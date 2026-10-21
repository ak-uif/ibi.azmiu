package az.edu.azmiu.ibi.auth;

import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthenticationService {

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthenticationService(AdminUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Authentication authenticate(String username, String password) {
        AdminUser admin = repository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!admin.isEnabled() || !passwordEncoder.matches(password, admin.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return UsernamePasswordAuthenticationToken.authenticated(admin.getUsername(), null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }
}
