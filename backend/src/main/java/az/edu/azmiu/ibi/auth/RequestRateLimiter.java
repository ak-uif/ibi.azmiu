package az.edu.azmiu.ibi.auth;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RequestRateLimiter implements HandlerInterceptor {
    private final int formLimit;
    private final int loginLimit;
    private final long windowNanos;
    private final Set<String> trustedProxies;
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();
    private final AtomicInteger requests = new AtomicInteger();

    public RequestRateLimiter(@Value("${PUBLIC_FORM_RATE_LIMIT:30}") int formLimit,
            @Value("${LOGIN_RATE_LIMIT:10}") int loginLimit,
            @Value("${RATE_LIMIT_WINDOW_SECONDS:60}") int windowSeconds,
            @Value("${TRUSTED_PROXY_IPS:}") String trustedProxyIps) {
        if (formLimit < 1 || formLimit > 10000 || loginLimit < 1 || loginLimit > 10000
                || windowSeconds < 1 || windowSeconds > 3600) {
            throw new IllegalArgumentException("Rate limits or window are out of range");
        }
        this.formLimit = formLimit;
        this.loginLimit = loginLimit;
        this.windowNanos = Duration.ofSeconds(windowSeconds).toNanos();
        this.trustedProxies = Set.copyOf(Arrays.stream(trustedProxyIps.split(","))
                .map(String::trim).filter(value -> !value.isEmpty()).toList());
        if (this.trustedProxies.stream().anyMatch(value -> !validIp(value))) {
            throw new IllegalArgumentException("Trusted proxy IPs must be valid addresses");
        }
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {
        if (!"POST".equals(request.getMethod())) return true;
        String path = request.getRequestURI().substring(request.getContextPath().length());
        boolean login = path.equals("/api/auth/login");
        boolean form = Set.of("/api/public/applications/programs", "/api/public/applications/events",
                "/api/public/applications/mentors", "/api/public/applications/startups").contains(path);
        if (!login && !form) return true;
        String key = (login ? "login|" : "form|") + clientIp(request);
        int limit = login ? loginLimit : formLimit;
        long now = System.nanoTime();
        Window window = windows.compute(key, (ignored, previous) ->
                previous == null || now - previous.started() >= windowNanos
                        ? new Window(now, 1)
                        : new Window(previous.started(), Math.min(previous.count() + 1, limit + 1)));
        if (requests.incrementAndGet() % 1000 == 0) {
            windows.entrySet().removeIf(entry -> now - entry.getValue().started() >= windowNanos);
        }
        if (window.count() <= limit) return true;
        response.setStatus(429);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setHeader("Cache-Control", "no-store");
        long remaining = windowNanos - Math.max(0, now - window.started());
        response.setHeader("Retry-After", String.valueOf(Math.max(1, (remaining + 999_999_999L) / 1_000_000_000L)));
        response.getWriter().write(
                "{\"code\":\"rate_limited\",\"message\":\"Çox sorğu göndərildi. Bir az sonra yenidən cəhd edin.\"}");
        return false;
    }

    String clientIp(HttpServletRequest request) {
        String remote = request.getRemoteAddr();
        if (remote == null) return "unknown";
        if (!trustedProxies.contains(remote)) return remote;
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded == null) return remote;
        String[] hops = forwarded.split(",");
        for (int i = hops.length - 1; i >= 0; i--) {
            String candidate = hops[i].trim();
            if (!validIp(candidate)) return remote;
            if (!trustedProxies.contains(candidate)) return candidate;
        }
        return remote;
    }

    private static boolean validIp(String value) {
        boolean ipv4 = value.matches("[0-9.]+") && value.contains(".");
        boolean ipv6 = value.contains(":") && value.matches("[0-9a-fA-F:.]+");
        if (!ipv4 && !ipv6) return false;
        try {
            InetAddress.getByName(value);
            return true;
        } catch (UnknownHostException exception) {
            return false;
        }
    }

    private record Window(long started, int count) {}
}
