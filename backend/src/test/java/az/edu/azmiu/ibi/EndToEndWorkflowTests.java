package az.edu.azmiu.ibi;

import java.nio.charset.StandardCharsets;

import az.edu.azmiu.ibi.auth.AdminUser;
import az.edu.azmiu.ibi.auth.AdminUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class EndToEndWorkflowTests {
    private static final String ACTOR = "phase14-workflow-admin";
    private static final String TEST_PASSWORD = "test-only-workflow-password";
    private static final String EMAIL = "phase14-workflow@example.com";

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired AdminUserRepository admins;
    @Autowired PasswordEncoder encoder;

    @Test
    void publicSubmissionCanBeReviewedExportedAndAuditedThroughAnAdminSession() throws Exception {
        admins.saveAndFlush(new AdminUser(ACTOR, encoder.encode(TEST_PASSWORD)));
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Phase 14 Applicant\",\"email\":\"" + EMAIL + "\","
                        + "\"phone\":\"+994 50 000 00 00\",\"selectedProgram\":\"Test Program\","
                        + "\"faculty\":\"Architecture\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("submitted"));
        Long id = jdbc.queryForObject("SELECT id FROM program_applications WHERE email = ?",
                Long.class, EMAIL);
        assertEquals("NEW", jdbc.queryForObject("SELECT status FROM program_applications WHERE id = ?",
                String.class, id));

        mvc.perform(get("/api/admin/applications").param("search", EMAIL))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + ACTOR + "\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
        MvcResult login = mvc.perform(post("/api/auth/login").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + ACTOR + "\",\"password\":\"" + TEST_PASSWORD + "\"}"))
                .andExpect(status().isOk()).andReturn();
        MockHttpSession session = (MockHttpSession) login.getRequest().getSession(false);

        mvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk()).andExpect(jsonPath("$.username").value(ACTOR));
        mvc.perform(get("/api/admin/applications").session(session).param("search", EMAIL))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].status").value("NEW"));
        mvc.perform(get("/api/admin/applications/program/" + id).session(session))
                .andExpect(status().isOk()).andExpect(jsonPath("$.faculty").value("Architecture"));
        mvc.perform(patch("/api/admin/applications/program/" + id + "/status")
                .session(session).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"REVIEWING\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("REVIEWING"));
        assertEquals("REVIEWING", jdbc.queryForObject(
                "SELECT status FROM program_applications WHERE id = ?", String.class, id));

        String csv = new String(mvc.perform(get("/api/admin/applications/export").session(session)
                .param("search", EMAIL).param("status", "REVIEWING"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsByteArray(),
                StandardCharsets.UTF_8);
        assertTrue(csv.contains(EMAIL));
        assertTrue(csv.contains("REVIEWING"));
        mvc.perform(get("/api/admin/activity").session(session).param("admin", ACTOR))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(4));

        mvc.perform(post("/api/auth/logout").session(session).with(csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/admin/applications").session(session))
                .andExpect(status().isUnauthorized());
    }
}
