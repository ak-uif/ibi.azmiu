package az.edu.azmiu.ibi;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import javax.sql.DataSource;

import az.edu.azmiu.ibi.model.Event;
import az.edu.azmiu.ibi.auth.AdminUser;
import az.edu.azmiu.ibi.model.EventRegistration;
import az.edu.azmiu.ibi.model.Mentor;
import az.edu.azmiu.ibi.model.MentorApplication;
import az.edu.azmiu.ibi.model.News;
import az.edu.azmiu.ibi.model.Partner;
import az.edu.azmiu.ibi.model.Program;
import az.edu.azmiu.ibi.model.ProgramApplication;
import az.edu.azmiu.ibi.model.Startup;
import az.edu.azmiu.ibi.model.StartupApplication;
import jakarta.persistence.EntityManagerFactory;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class IbiBackendApplicationTests {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Flyway flyway;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Test
    void contextLoads() {
    }

    @Test
    void databaseMigrationAndEntitiesLoad() throws SQLException {
        Set<String> tables = new HashSet<>();
        try (Connection connection = dataSource.getConnection();
             ResultSet results = connection.getMetaData().getTables(null, "public", "%", new String[]{"TABLE"})) {
            assertTrue(connection.isValid(2));
            while (results.next()) {
                tables.add(results.getString("TABLE_NAME"));
            }
        }

        assertTrue(tables.containsAll(Set.of(
                "programs", "events", "news", "mentors", "startups", "partners",
                "program_applications", "event_registrations", "mentor_applications", "startup_applications",
                "admin_users")));
        assertEquals("2", flyway.info().current().getVersion().getVersion());

        Set<Class<?>> entities = new HashSet<>();
        entityManagerFactory.getMetamodel().getEntities()
                .forEach(entity -> entities.add(entity.getJavaType()));
        assertTrue(entities.containsAll(Set.of(
                Program.class, Event.class, News.class, Mentor.class, Startup.class, Partner.class,
                ProgramApplication.class, EventRegistration.class, MentorApplication.class, StartupApplication.class,
                AdminUser.class)));
    }
}
