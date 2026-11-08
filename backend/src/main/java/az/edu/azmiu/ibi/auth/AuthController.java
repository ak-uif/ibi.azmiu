package az.edu.azmiu.ibi.auth;

import java.util.Map;

import az.edu.azmiu.ibi.activity.AdminActivityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminAuthenticationService authenticationService;
    private final SecurityContextRepository contextRepository;
    private final AdminActivityService activity;

    public AuthController(AdminAuthenticationService authenticationService,
            SecurityContextRepository contextRepository, AdminActivityService activity) {
        this.authenticationService = authenticationService;
        this.contextRepository = contextRepository;
        this.activity = activity;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("token", token.getToken());
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest credentials,
            HttpServletRequest request, HttpServletResponse response) {
        if (credentials.username() == null || credentials.username().isBlank()
                || credentials.password() == null || credentials.password().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "İstifadəçi adı və ya şifrə yanlışdır."));
        }
        try {
            Authentication authentication = authenticationService.authenticate(
                    credentials.username().trim(), credentials.password());
            HttpSession session = request.getSession(true);
            request.changeSessionId();
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            contextRepository.saveContext(context, request, response);
            try {
                activity.recordAuthentication(authentication.getName(), "LOGIN");
            } catch (RuntimeException exception) {
                SecurityContextHolder.clearContext();
                session.invalidate();
                throw exception;
            }
            return ResponseEntity.ok(Map.of("username", authentication.getName()));
        } catch (AuthenticationException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "İstifadəçi adı və ya şifrə yanlışdır."));
        }
    }

    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        return Map.of("username", authentication.getName());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, Authentication authentication) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            activity.recordAuthentication(authentication.getName(), "LOGOUT");
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    public record LoginRequest(String username, String password) {
    }
}
