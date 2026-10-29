package az.edu.azmiu.ibi.content;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PublicContentApiTests {
    @Autowired MockMvc mvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void onlyActiveProgramsAndPublishedRecordsArePublic() throws Exception {
        check("programs", "{\"status\":\"draft\",\"titleAz\":\"Hidden phase8\",\"descriptionAz\":\"Test\"}",
                "{\"status\":\"active\",\"titleAz\":\"Visible phase8\",\"descriptionAz\":\"Test\"}");
        check("events", "{\"titleAz\":\"Hidden phase8\",\"descriptionAz\":\"Test\"}",
                "{\"titleAz\":\"Visible phase8\",\"descriptionAz\":\"Test\",\"published\":true}");
        check("news", "{\"titleAz\":\"Hidden phase8\"}",
                "{\"titleAz\":\"Visible phase8\",\"published\":true}");
        check("mentors", "{\"name\":\"Hidden phase8\"}",
                "{\"name\":\"Visible phase8\",\"published\":true}");
        check("startups", "{\"name\":\"Hidden phase8\",\"descriptionAz\":\"Test\"}",
                "{\"name\":\"Visible phase8\",\"descriptionAz\":\"Test\",\"published\":true}");
        check("partners", "{\"name\":\"Hidden phase8\"}",
                "{\"name\":\"Visible phase8\",\"published\":true}");
    }

    private void check(String type, String hidden, String visible) throws Exception {
        String admin = "/api/admin/" + type;
        mvc.perform(post(admin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(hidden))
                .andExpect(status().isCreated());
        mvc.perform(post(admin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(visible))
                .andExpect(status().isCreated());
        String publicPath = "/api/public/" + type;
        String response = mvc.perform(get(publicPath).with(anonymous())).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        List<Map<String, Object>> rows = JsonPath.read(response, "$[*]");
        String field = type.equals("mentors") || type.equals("startups") || type.equals("partners") ? "name" : "titleAz";
        assertFalse(rows.stream().anyMatch(row -> "Hidden phase8".equals(row.get(field))));
        assertTrue(rows.stream().anyMatch(row -> "Visible phase8".equals(row.get(field))));
        mvc.perform(post(publicPath).with(anonymous()).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content(visible)).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void archivedProgramNeverAppears() throws Exception {
        mvc.perform(post("/api/admin/programs").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"archived\",\"titleAz\":\"Archived phase8\",\"descriptionAz\":\"Test\"}"))
                .andExpect(status().isCreated());
        String response = mvc.perform(get("/api/public/programs").with(anonymous())).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertFalse(response.contains("Archived phase8"));
    }
}
