package az.edu.azmiu.ibi.content;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminApplicationApiTests {

    @Test
    void csvEscapesFormulaPrefixesBehindInvisibleCharacters() {
        assertEquals("\"'\uFEFF=1+1\"", AdminApplicationService.csvCell("\uFEFF=1+1"));
        assertEquals("\"'\t+1\"", AdminApplicationService.csvCell("\t+1"));
        assertEquals("\"normal\"", AdminApplicationService.csvCell("normal"));
    }
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired EntityManager entityManager;

    @Test
    void listsAllTypesWithFiltersSearchSortingAndPagination() throws Exception {
        Map<String, Long> ids = seed();
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-").param("size", "2"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.total").value(4)).andExpect(jsonPath("$.totalPages").value(2));
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-").param("page", "1").param("size", "2"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items.length()").value(2));
        for (String type : ids.keySet()) {
            mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-").param("type", type))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                    .andExpect(jsonPath("$.items[0].type").value(type));
        }
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "Startup Example"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].type").value("startup"));
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-").param("sort", "oldest"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].type").value("program"));
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-").param("sort", "newest"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].type").value("startup"));
    }

    @Test
    void detailsPreserveEverySubmittedFieldAndStatusChangesPersist() throws Exception {
        Map<String, Long> ids = seed();
        mvc.perform(get("/api/admin/applications/program/" + ids.get("program")).with(admin()))
                .andExpect(jsonPath("$.selectedProgram").value("Intro, \"safe\""))
                .andExpect(jsonPath("$.faculty").value("Architecture"));
        mvc.perform(get("/api/admin/applications/event/" + ids.get("event")).with(admin()))
                .andExpect(jsonPath("$.eventTitle").value("Design Day"))
                .andExpect(jsonPath("$.format").value("online"));
        mvc.perform(get("/api/admin/applications/mentor/" + ids.get("mentor")).with(admin()))
                .andExpect(jsonPath("$.companyRole").value("Designer"))
                .andExpect(jsonPath("$.expertise").value("design"))
                .andExpect(jsonPath("$.linkedin").value("https://linkedin.com/in/example"))
                .andExpect(jsonPath("$.bio").value("Mentorship experience"))
                .andExpect(jsonPath("$.hasCv").value(false))
                .andExpect(jsonPath("$.cvStorageKey").doesNotExist());
        jdbc.update("UPDATE mentor_applications SET cv_storage_key = ? WHERE id = ?",
                "00000000000000000000000000000000.pdf", ids.get("mentor"));
        entityManager.clear();
        mvc.perform(get("/api/admin/applications/mentor/" + ids.get("mentor")).with(admin()))
                .andExpect(jsonPath("$.hasCv").value(true))
                .andExpect(jsonPath("$.cvFormat").value("PDF"))
                .andExpect(jsonPath("$.cvStorageKey").doesNotExist());
        mvc.perform(get("/api/admin/applications/startup/" + ids.get("startup")).with(admin()))
                .andExpect(jsonPath("$.startupTitle").value("Startup Example"))
                .andExpect(jsonPath("$.stage").value("mvp"))
                .andExpect(jsonPath("$.description").value("A useful product"));
        for (String status : new String[]{"REVIEWING", "ACCEPTED", "REJECTED", "ARCHIVED", "NEW"}) {
            mvc.perform(patch("/api/admin/applications/mentor/" + ids.get("mentor") + "/status")
                    .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"status\":\"" + status + "\"}"))
                    .andExpect(status().isOk()).andExpect(jsonPath("$.status").value(status));
            assertEquals(status, jdbc.queryForObject("SELECT status FROM mentor_applications WHERE id = ?",
                    String.class, ids.get("mentor")));
        }
        mvc.perform(patch("/api/admin/applications/mentor/" + ids.get("mentor") + "/status")
                .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ACCEPTED\"}"))
                .andExpect(status().isOk());
        for (String type : new String[]{"program", "event", "startup"}) {
            mvc.perform(patch("/api/admin/applications/" + type + "/" + ids.get(type) + "/status")
                    .with(admin()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"status\":\"ACCEPTED\"}"))
                    .andExpect(status().isOk());
        }
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "phase11-")
                        .param("type", "mentor").param("status", "ACCEPTED"))
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].type").value("mentor"));
    }

    @Test
    void rejectsInvalidInputsAndMissingApplications() throws Exception {
        mvc.perform(get("/api/admin/applications").with(admin()).param("type", "unknown"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("invalid_request"));
        mvc.perform(get("/api/admin/applications").with(admin()).param("status", "INVALID"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications").with(admin()).param("sort", "random"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications").with(admin()).param("page", "-1"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications").with(admin()).param("size", "101"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications").with(admin()).param("search", "x".repeat(201)))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications/unknown/1").with(admin()))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/admin/applications/program/99999999").with(admin()))
                .andExpect(status().isNotFound());
        mvc.perform(patch("/api/admin/applications/program/1/status").with(admin()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"BAD\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void csvIsFilteredEscapedAndNeverContainsCvPaths() throws Exception {
        seed();
        String csv = new String(mvc.perform(get("/api/admin/applications/export").with(admin())
                .param("type", "program").param("search", "phase11-")).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
        assertTrue(csv.contains("\"'=1+1\""));
        assertTrue(csv.contains("\"Intro, \"\"safe\"\"\""));
        assertFalse(csv.contains("cv_storage_key"));
        assertFalse(csv.contains("/mentor-cvs/"));
        assertFalse(csv.contains("Startup Example"));
        mvc.perform(get("/api/admin/applications/export").with(admin()).param("status", "ARCHIVED"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/admin/applications/export").with(admin()).param("type", "bad"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void everyManagementRouteRequiresAdmin() throws Exception {
        for (String path : new String[]{"/api/admin/applications", "/api/admin/applications/export",
                "/api/admin/applications/mentor/1", "/api/admin/mentor-applications/1/cv"}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
            mvc.perform(get(path).with(user("visitor").roles("USER")))
                    .andExpect(status().isForbidden());
        }
        String statusPath = "/api/admin/applications/mentor/1/status";
        mvc.perform(patch(statusPath).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"NEW\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(patch(statusPath).with(user("visitor").roles("USER")).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"NEW\"}"))
                .andExpect(status().isForbidden());
    }

    private Map<String, Long> seed() throws Exception {
        Long program = create("programs", "program_applications", "phase11-program@example.com",
                "{\"fullName\":\"=1+1\",\"email\":\"phase11-program@example.com\",\"phone\":\"+994 50 000 00 00\",\"selectedProgram\":\"Intro, \\\"safe\\\"\",\"faculty\":\"Architecture\"}");
        Long event = create("events", "event_registrations", "phase11-event@example.com",
                "{\"fullName\":\"Event Person\",\"email\":\"phase11-event@example.com\",\"phone\":\"+994 50 000 00 00\",\"eventTitle\":\"Design Day\",\"format\":\"online\"}");
        Long mentor = create("mentors", "mentor_applications", "phase11-mentor@example.com",
                "{\"fullName\":\"Mentor Person\",\"email\":\"phase11-mentor@example.com\",\"phone\":\"+994 50 000 00 00\",\"companyRole\":\"Designer\",\"expertise\":\"design\",\"linkedin\":\"https://linkedin.com/in/example\",\"bio\":\"Mentorship experience\"}");
        Long startup = create("startups", "startup_applications", "phase11-startup@example.com",
                "{\"fullName\":\"Startup Person\",\"email\":\"phase11-startup@example.com\",\"phone\":\"+994 50 000 00 00\",\"startupTitle\":\"Startup Example\",\"stage\":\"mvp\",\"description\":\"A useful product\"}");
        return Map.of("program", program, "event", event, "mentor", mentor, "startup", startup);
    }

    private Long create(String path, String table, String email, String body) throws Exception {
        mvc.perform(post("/api/public/applications/" + path).contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isCreated());
        return jdbc.queryForObject("SELECT id FROM " + table + " WHERE email = ? ORDER BY id DESC LIMIT 1",
                Long.class, email);
    }

    private static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.UserRequestPostProcessor admin() {
        return user("admin").roles("ADMIN");
    }
}
