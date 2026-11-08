package az.edu.azmiu.ibi.activity;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import az.edu.azmiu.ibi.auth.AdminUser;
import az.edu.azmiu.ibi.auth.AdminUserRepository;
import az.edu.azmiu.ibi.content.MentorCvStorage;
import az.edu.azmiu.ibi.content.ProgramService;
import az.edu.azmiu.ibi.content.ContentDtos.ProgramRequest;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.TransactionDefinition;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminActivityApiTests {
    private static final String ACTOR = "phase12-audit-test";
    private static final Path STORAGE = Path.of(System.getProperty("java.io.tmpdir"),
            "ibi-phase14-activity-cvs-" + UUID.randomUUID());

    @DynamicPropertySource
    static void isolatedStorage(DynamicPropertyRegistry registry) {
        registry.add("CV_STORAGE_DIR", STORAGE::toString);
    }

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired PasswordEncoder encoder;
    @Autowired MentorCvStorage storage;
    @Autowired ProgramService programs;
    @Autowired PlatformTransactionManager transactionManager;
    @MockitoBean AdminUserRepository users;

    @BeforeEach
    void adminExists() {
        when(users.findByUsername(ACTOR)).thenReturn(Optional.of(new AdminUser(ACTOR, encoder.encode("test-only"))));
    }

    @Test
    void successfulLoginAndLogoutAreLoggedButFailuresAreNot() throws Exception {
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + ACTOR + "\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
        assertEquals(0, count("LOGIN"));
        MvcResult login = mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + ACTOR + "\",\"password\":\"test-only\"}"))
                .andExpect(status().isOk()).andReturn();
        assertEquals(1, count("LOGIN"));
        MockHttpSession session = (MockHttpSession) login.getRequest().getSession(false);
        mvc.perform(post("/api/auth/logout").session(session).with(csrf()))
                .andExpect(status().isNoContent());
        assertEquals(1, count("LOGOUT"));
    }

    @Test
    void contentCreatePublishUnpublishArchiveRestoreEditAndDeleteAreLogged() throws Exception {
        long program = createContent("programs",
                "{\"status\":\"draft\",\"titleAz\":\"Audit program\",\"descriptionAz\":\"Description\"}");
        assertEquals(1, count("CONTENT_CREATED"));
        updateContent("programs", program, "{\"status\":\"open\",\"titleAz\":\"Audit program\",\"descriptionAz\":\"Description\"}");
        updateContent("programs", program, "{\"status\":\"archived\",\"titleAz\":\"Audit program\",\"descriptionAz\":\"Description\"}");
        updateContent("programs", program, "{\"status\":\"draft\",\"titleAz\":\"Audit program\",\"descriptionAz\":\"Description\"}");
        updateContent("programs", program, "{\"status\":\"draft\",\"titleAz\":\"Edited program\",\"descriptionAz\":\"Description\"}");
        long event = createContent("events", "{\"titleAz\":\"Audit event\",\"descriptionAz\":\"Description\"}");
        updateContent("events", event, "{\"titleAz\":\"Audit event\",\"descriptionAz\":\"Description\",\"published\":true}");
        updateContent("events", event, "{\"titleAz\":\"Audit event\",\"descriptionAz\":\"Description\",\"published\":false}");
        for (String type : new String[]{"news", "mentors", "startups", "partners"}) {
            String json = switch (type) {
                case "news" -> "{\"titleAz\":\"Audit news\"}";
                case "mentors" -> "{\"name\":\"Audit mentor\"}";
                case "startups" -> "{\"name\":\"Audit startup\",\"descriptionAz\":\"Description\"}";
                default -> "{\"name\":\"Audit partner\"}";
            };
            createContent(type, json);
        }
        mvc.perform(delete("/api/admin/programs/" + program).with(admin()).with(csrf()))
                .andExpect(status().isNoContent());
        assertEquals(1, count("CONTENT_ARCHIVED"));
        assertEquals(1, count("CONTENT_RESTORED"));
        assertEquals(2, count("CONTENT_PUBLISHED"));
        assertEquals(1, count("CONTENT_UNPUBLISHED"));
        assertEquals(1, count("CONTENT_UPDATED"));
        assertEquals(1, count("CONTENT_DELETED"));
        assertEquals(6, count("CONTENT_CREATED"));
        assertEquals(program, jdbc.queryForObject(
                "SELECT record_id FROM admin_activity_log WHERE admin_username = ? AND action = 'CONTENT_DELETED'",
                Long.class, ACTOR));
        int before = total();
        mvc.perform(delete("/api/admin/programs/99999999").with(admin()).with(csrf()))
                .andExpect(status().isNotFound());
        mvc.perform(post("/api/admin/news").with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andExpect(status().isBadRequest());
        assertEquals(before, total());
    }

    @Test
    @WithMockUser(username = ACTOR, roles = "ADMIN")
    void rolledBackContentChangeHasNoSuccessEntry() {
        TransactionTemplate transactions = new TransactionTemplate(transactionManager);
        transactions.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        assertThrows(IllegalStateException.class, () -> transactions.executeWithoutResult(status -> {
            programs.create(new ProgramRequest(null, "draft", "Rollback program", null, "Description",
                    null, null, null, null, null, null, null, null, null, null, null, null));
            throw new IllegalStateException("rollback test");
        }));
        assertEquals(0, count("CONTENT_CREATED"));
        assertEquals(0, jdbc.queryForObject("SELECT count(*) FROM programs WHERE title_az = 'Rollback program'", Integer.class));
    }

    @Test
    void applicationViewStatusExportAndCvDownloadAreLoggedWithoutPrivateData() throws Exception {
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Audit Applicant\",\"email\":\"phase12-private@example.com\","
                        + "\"phone\":\"+994 50 000 00 00\",\"selectedProgram\":\"Audit Program\","
                        + "\"faculty\":\"Architecture\"}")).andExpect(status().isCreated());
        Long id = jdbc.queryForObject("SELECT id FROM program_applications WHERE email = ? ORDER BY id DESC LIMIT 1",
                Long.class, "phase12-private@example.com");
        mvc.perform(get("/api/admin/applications/program/" + id).with(admin()))
                .andExpect(status().isOk());
        mvc.perform(patch("/api/admin/applications/program/" + id + "/status")
                .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ACCEPTED\"}")).andExpect(status().isOk());
        mvc.perform(patch("/api/admin/applications/program/" + id + "/status")
                .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"INVALID\"}")).andExpect(status().isBadRequest());
        mvc.perform(patch("/api/admin/applications/program/" + id + "/status")
                .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ACCEPTED\"}")).andExpect(status().isOk());
        mvc.perform(get("/api/admin/applications/export").with(admin()).param("type", "program")
                .param("search", "phase12-private")).andExpect(status().isOk());
        assertEquals(1, count("APPLICATION_VIEWED"));
        assertEquals(1, count("APPLICATION_STATUS_CHANGED"));
        assertEquals(1, count("APPLICATIONS_EXPORTED"));
        assertEquals("ACCEPTED", jdbc.queryForObject(
                "SELECT detail FROM admin_activity_log WHERE admin_username = ? AND action = 'APPLICATION_STATUS_CHANGED'",
                String.class, ACTOR));

        byte[] pdf = "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF".getBytes(StandardCharsets.US_ASCII);
        MockMultipartFile application = new MockMultipartFile("application", "", "application/json",
                "{\"fullName\":\"CV Applicant\",\"email\":\"phase12-cv@example.com\",\"phone\":\"+994 50 000 00 00\","
                        .concat("\"companyRole\":\"Designer\",\"expertise\":\"design\",\"linkedin\":\"https://example.com\",\"bio\":\"Experience\"}")
                        .getBytes(StandardCharsets.UTF_8));
        mvc.perform(multipart("/api/public/applications/mentors").file(application)
                .file(new MockMultipartFile("cv", "test.pdf", "application/pdf", pdf)))
                .andExpect(status().isCreated());
        Long mentorId = jdbc.queryForObject("SELECT id FROM mentor_applications WHERE email = ? ORDER BY id DESC LIMIT 1",
                Long.class, "phase12-cv@example.com");
        String key = jdbc.queryForObject("SELECT cv_storage_key FROM mentor_applications WHERE id = ?",
                String.class, mentorId);
        try {
            mvc.perform(get("/api/admin/mentor-applications/" + mentorId + "/cv").with(admin()))
                    .andExpect(status().isOk());
            assertEquals(1, count("CV_DOWNLOADED"));
            mvc.perform(get("/api/admin/mentor-applications/99999999/cv").with(admin()))
                    .andExpect(status().isNotFound());
            assertEquals(1, count("CV_DOWNLOADED"));
            String safeFields = jdbc.queryForObject("""
                    SELECT string_agg(coalesce(action, '') || coalesce(record_type, '') ||
                                      coalesce(detail, '') || admin_username, ' ')
                    FROM admin_activity_log WHERE admin_username = ?
                    """, String.class, ACTOR);
            assertFalse(safeFields.contains("phase12-private@example.com"));
            assertFalse(safeFields.contains(key));
            assertFalse(safeFields.contains("test.pdf"));
            assertFalse(safeFields.contains("%PDF"));
        } finally {
            storage.delete(key);
        }
    }

    @Test
    void historyIsReadOnlyFilteredPagedAndAdminOnly() throws Exception {
        jdbc.update("INSERT INTO admin_activity_log (admin_username, action, record_type, record_id) VALUES (?, ?, ?, ?)",
                ACTOR, "CONTENT_CREATED", "program", 12);
        jdbc.update("INSERT INTO admin_activity_log (admin_username, action, record_type, record_id) VALUES (?, ?, ?, ?)",
                ACTOR, "CONTENT_UPDATED", "program", 12);
        jdbc.update("INSERT INTO admin_activity_log (admin_username, action) VALUES (?, ?)", ACTOR, "LOGIN");
        String today = LocalDate.now(ZoneOffset.UTC).toString();
        mvc.perform(get("/api/admin/activity").with(admin()).param("admin", ACTOR).param("size", "2"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].action").value("LOGIN"))
                .andExpect(jsonPath("$.totalPages").value(2));
        mvc.perform(get("/api/admin/activity").with(admin()).param("admin", ACTOR).param("size", "2")
                .param("page", "1")).andExpect(jsonPath("$.items.length()").value(1));
        mvc.perform(get("/api/admin/activity").with(admin()).param("admin", ACTOR)
                .param("action", "CONTENT_CREATED").param("recordType", "program")
                .param("recordId", "12").param("from", today).param("to", today))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].action").value("CONTENT_CREATED"));
        for (String bad : new String[]{"bad", "CONTENT_SECRET"}) {
            mvc.perform(get("/api/admin/activity").with(admin()).param("action", bad))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(get("/api/admin/activity").with(admin()).param("from", "not-a-date"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/activity").with(admin()).param("page", "-1"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/activity")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/activity").with(user("visitor").roles("USER")))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/admin/activity").with(admin()).with(csrf()))
                .andExpect(status().isMethodNotAllowed());
        mvc.perform(put("/api/admin/activity/1").with(admin()).with(csrf()))
                .andExpect(status().isNotFound());
        mvc.perform(delete("/api/admin/activity/1").with(admin()).with(csrf()))
                .andExpect(status().isNotFound());
    }

    private long createContent(String type, String json) throws Exception {
        MvcResult result = mvc.perform(post("/api/admin/" + type).with(admin()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated()).andReturn();
        return ((Number) JsonPath.read(result.getResponse().getContentAsString(), "$.id")).longValue();
    }

    private void updateContent(String type, long id, String json) throws Exception {
        mvc.perform(put("/api/admin/" + type + "/" + id).with(admin()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk());
    }

    private int count(String action) {
        return jdbc.queryForObject("SELECT count(*) FROM admin_activity_log WHERE admin_username = ? AND action = ?",
                Integer.class, ACTOR, action);
    }

    private int total() {
        return jdbc.queryForObject("SELECT count(*) FROM admin_activity_log WHERE admin_username = ?",
                Integer.class, ACTOR);
    }

    private static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.UserRequestPostProcessor admin() {
        return user(ACTOR).roles("ADMIN");
    }
}
