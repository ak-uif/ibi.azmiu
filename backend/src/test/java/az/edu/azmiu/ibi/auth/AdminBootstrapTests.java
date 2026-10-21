package az.edu.azmiu.ibi.auth;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

class AdminBootstrapTests {

    @Test
    void initialAdminIsHashedAndExistingAdminIsNotReplaced() throws Exception {
        AdminUserRepository repository = mock(AdminUserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String testPassword = "only-a-test-password";
        when(repository.count()).thenReturn(0L);

        new AdminBootstrap(repository, encoder, "admin", testPassword)
                .run(new DefaultApplicationArguments(new String[0]));
        ArgumentCaptor<AdminUser> saved = ArgumentCaptor.forClass(AdminUser.class);
        verify(repository).save(saved.capture());
        assertNotEquals(testPassword, saved.getValue().getPasswordHash());
        assertTrue(encoder.matches(testPassword, saved.getValue().getPasswordHash()));

        AdminUserRepository existingRepository = mock(AdminUserRepository.class);
        when(existingRepository.count()).thenReturn(1L);
        new AdminBootstrap(existingRepository, encoder, "another-admin", "different-test-password")
                .run(new DefaultApplicationArguments(new String[0]));
        verify(existingRepository).count();
        verifyNoMoreInteractions(existingRepository);
    }
}
