package az.edu.azmiu.ibi.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class AdminBootstrap implements ApplicationRunner {

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminBootstrap(AdminUserRepository repository, PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USERNAME:admin}") String username,
            @Value("${ADMIN_PASSWORD:}") String password) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank()) {
            throw new IllegalStateException("ADMIN_USERNAME must be set locally.");
        }
        if (repository.count() > 0) {
            return;
        }
        if (password.isBlank()) {
            throw new IllegalStateException("ADMIN_PASSWORD must be set locally before the first admin is created.");
        }
        repository.save(new AdminUser(username, passwordEncoder.encode(password)));
    }
}
