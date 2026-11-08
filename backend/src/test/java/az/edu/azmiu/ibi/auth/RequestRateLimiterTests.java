package az.edu.azmiu.ibi.auth;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RequestRateLimiterTests {
    @Test
    void publicFormsAndLoginHaveSeparateLimitsAndReturnSafeErrors() throws Exception {
        RequestRateLimiter limiter = new RequestRateLimiter(2, 1, 60, "");
        MockHttpServletRequest form = request("/api/public/applications/programs", "192.0.2.1");
        MockHttpServletResponse response = new MockHttpServletResponse();
        assertTrue(limiter.preHandle(form, response, new Object()));
        assertTrue(limiter.preHandle(form, response, new Object()));
        assertFalse(limiter.preHandle(form, response, new Object()));
        assertEquals(429, response.getStatus());
        assertEquals("60", response.getHeader("Retry-After"));
        assertTrue(response.getContentAsString().contains("rate_limited"));

        MockHttpServletRequest login = request("/api/auth/login", "192.0.2.1");
        assertTrue(limiter.preHandle(login, new MockHttpServletResponse(), new Object()));
        assertFalse(limiter.preHandle(login, new MockHttpServletResponse(), new Object()));
        assertTrue(limiter.preHandle(request("/api/public/applications/events", "192.0.2.2"),
                new MockHttpServletResponse(), new Object()));
    }

    @Test
    void forwardedIpIsIgnoredUnlessImmediateProxyIsTrusted() {
        MockHttpServletRequest request = request("/api/auth/login", "192.0.2.8");
        request.addHeader("X-Forwarded-For", "198.51.100.2");
        assertEquals("192.0.2.8", new RequestRateLimiter(1, 1, 60, "").clientIp(request));

        MockHttpServletRequest proxied = request("/api/auth/login", "10.0.0.1");
        proxied.addHeader("X-Forwarded-For", "198.51.100.3, 10.0.0.2");
        assertEquals("198.51.100.3", new RequestRateLimiter(1, 1, 60, "10.0.0.1,10.0.0.2")
                .clientIp(proxied));
        MockHttpServletRequest malformed = request("/api/auth/login", "10.0.0.1");
        malformed.addHeader("X-Forwarded-For", "198.51.100.3, unknown");
        assertEquals("10.0.0.1", new RequestRateLimiter(1, 1, 60, "10.0.0.1")
                .clientIp(malformed));
    }

    @Test
    void corsOriginsMustBeExplicit() {
        SecurityConfig config = new SecurityConfig();
        assertThrows(IllegalArgumentException.class, () -> config.corsConfigurationSource("*"));
        assertThrows(IllegalArgumentException.class,
                () -> config.corsConfigurationSource("https://site.example/path"));
        config.corsConfigurationSource("http://localhost:5173,https://site.example");
    }

    private static MockHttpServletRequest request(String path, String ip) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setRemoteAddr(ip);
        return request;
    }
}
