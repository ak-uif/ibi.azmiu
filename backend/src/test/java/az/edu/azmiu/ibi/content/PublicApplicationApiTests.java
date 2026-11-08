package az.edu.azmiu.ibi.content;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PublicApplicationApiTests {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @Test
    void anonymousSubmissionsPersistInCorrectTablesWithNewStatus() throws Exception {
        check("programs", "program_applications", "selected_program", "Example Program",
                "{\"fullName\":\"Example Person\",\"email\":\"phase9@example.com\",\"phone\":\"+994 50 000 00 00\",\"selectedProgram\":\"Example Program\",\"faculty\":\"Architecture\"}");
        check("events", "event_registrations", "event_title", "Example Event",
                "{\"fullName\":\"Example Person\",\"email\":\"phase9@example.com\",\"phone\":\"+994 50 000 00 00\",\"eventTitle\":\"Example Event\",\"format\":\"online\"}");
        check("mentors", "mentor_applications", "expertise", "design",
                "{\"fullName\":\"Example Person\",\"email\":\"phase9@example.com\",\"phone\":\"+994 50 000 00 00\",\"companyRole\":\"Designer\",\"expertise\":\"design\",\"linkedin\":\"https://linkedin.com/in/example\",\"bio\":\"Mentorship experience\"}");
        check("startups", "startup_applications", "stage", "mvp",
                "{\"fullName\":\"Example Person\",\"email\":\"phase9@example.com\",\"phone\":\"+994 50 000 00 00\",\"startupTitle\":\"Example Startup\",\"stage\":\"mvp\",\"description\":\"A useful product\"}");
    }

    private void check(String path, String table, String column, String expected, String body) throws Exception {
        Integer before = jdbc.queryForObject("SELECT count(*) FROM " + table + " WHERE email = 'phase9@example.com'", Integer.class);
        mvc.perform(post("/api/public/applications/" + path)
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("submitted"));
        Integer after = jdbc.queryForObject("SELECT count(*) FROM " + table + " WHERE email = 'phase9@example.com'", Integer.class);
        assertEquals(before + 1, after);
        String saved = jdbc.queryForObject("SELECT " + column + " FROM " + table
                + " WHERE email = ? ORDER BY id DESC LIMIT 1", String.class, "phase9@example.com");
        assertEquals(expected, saved);
        assertEquals("NEW", jdbc.queryForObject("SELECT status FROM " + table
                + " WHERE email = ? ORDER BY id DESC LIMIT 1", String.class, "phase9@example.com"));
    }

    @Test
    void invalidDataAndReadAccessAreRejected() throws Exception {
        Integer before = jdbc.queryForObject("SELECT count(*) FROM program_applications", Integer.class);
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"A\",\"email\":\"bad\",\"phone\":\"1234567\",\"selectedProgram\":\"1\",\"faculty\":\"Architecture\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("validation_failed"));
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"" + "x".repeat(256)
                        + "\",\"email\":\"a@example.com\",\"phone\":\"1234567\",\"selectedProgram\":\"Example\",\"faculty\":\"Architecture\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("validation_failed"));
        assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM program_applications", Integer.class));
        mvc.perform(post("/api/public/applications/events").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"A\",\"email\":\"a@example.com\",\"phone\":\"1234567\",\"eventTitle\":\"1\",\"format\":\"unknown\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/public/applications/startups").contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/public/applications/programs")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/programs")).andExpect(status().isUnauthorized());
    }

    @Test
    void honeypotAndInvalidPhoneAreRejectedWithoutSaving() throws Exception {
        Integer before = jdbc.queryForObject("SELECT count(*) FROM program_applications", Integer.class);
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Example Person\",\"email\":\"safe@example.com\",\"phone\":\"1234567\","
                        + "\"selectedProgram\":\"Example\",\"faculty\":\"Architecture\",\"websiteConfirm\":\"spam\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("spam_detected"));
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Example Person\",\"email\":\"safe@example.com\",\"phone\":\"invalid-phone\","
                        + "\"selectedProgram\":\"Example\",\"faculty\":\"Architecture\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("validation_failed"));
        assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM program_applications", Integer.class));
    }

    @Test
    void honeypotRejectsEveryPublicFormWithoutSaving() throws Exception {
        String[][] cases = {
                {"events", "event_registrations", "\"eventTitle\":\"Example\",\"format\":\"online\""},
                {"startups", "startup_applications", "\"startupTitle\":\"Example\",\"stage\":\"mvp\",\"description\":\"Idea\""}
        };
        for (String[] testCase : cases) {
            Integer before = jdbc.queryForObject("SELECT count(*) FROM " + testCase[1], Integer.class);
            String body = "{\"fullName\":\"Example Person\",\"email\":\"safe@example.com\",\"phone\":\"1234567\","
                    + testCase[2] + ",\"websiteConfirm\":\"spam\"}";
            mvc.perform(post("/api/public/applications/" + testCase[0]).contentType(MediaType.APPLICATION_JSON)
                    .content(body)).andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code").value("spam_detected"));
            assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM " + testCase[1], Integer.class));
        }
        Integer before = jdbc.queryForObject("SELECT count(*) FROM mentor_applications", Integer.class);
        String mentor = "{\"fullName\":\"Example Person\",\"email\":\"safe@example.com\",\"phone\":\"1234567\","
                + "\"companyRole\":\"Designer\",\"expertise\":\"design\",\"linkedin\":\"https://linkedin.com/in/example\","
                + "\"bio\":\"Mentorship experience\",\"websiteConfirm\":\"spam\"}";
        mvc.perform(multipart("/api/public/applications/mentors")
                .file(new MockMultipartFile("application", "", MediaType.APPLICATION_JSON_VALUE,
                        mentor.getBytes(java.nio.charset.StandardCharsets.UTF_8))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("spam_detected"));
        assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM mentor_applications", Integer.class));
    }
}
