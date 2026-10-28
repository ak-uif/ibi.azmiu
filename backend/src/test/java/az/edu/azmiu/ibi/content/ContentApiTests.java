package az.edu.azmiu.ibi.content;

import java.util.stream.Stream;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ContentApiTests {

    @Autowired
    private MockMvc mvc;

    static Stream<ResourceCase> resources() {
        return Stream.of(
                new ResourceCase("programs",
                        "{\"status\":\"DRAFT\",\"titleAz\":\"Test program\",\"descriptionAz\":\"Test description\"}",
                        "{\"status\":\"ACTIVE\",\"titleAz\":\"Updated program\",\"descriptionAz\":\"Updated description\"}",
                        "titleAz", "Updated program"),
                new ResourceCase("events",
                        "{\"titleAz\":\"Test event\",\"descriptionAz\":\"Test description\"}",
                        "{\"titleAz\":\"Updated event\",\"descriptionAz\":\"Updated description\",\"published\":true}",
                        "titleAz", "Updated event"),
                new ResourceCase("news",
                        "{\"titleAz\":\"Test news\"}",
                        "{\"titleAz\":\"Updated news\",\"published\":true}",
                        "titleAz", "Updated news"),
                new ResourceCase("mentors",
                        "{\"name\":\"Test mentor\",\"skills\":[\"Java\"]}",
                        "{\"name\":\"Updated mentor\",\"skills\":[\"PostgreSQL\"],\"published\":true}",
                        "name", "Updated mentor"),
                new ResourceCase("startups",
                        "{\"name\":\"Test startup\",\"descriptionAz\":\"Test description\",\"founders\":[{\"name\":\"Tester\"}]}",
                        "{\"name\":\"Updated startup\",\"descriptionAz\":\"Updated description\",\"techStack\":[\"Java\"]}",
                        "name", "Updated startup"),
                new ResourceCase("partners",
                        "{\"name\":\"Test partner\"}",
                        "{\"name\":\"Updated partner\",\"published\":true}",
                        "name", "Updated partner"));
    }

    @ParameterizedTest
    @MethodSource("resources")
    @WithMockUser(roles = "ADMIN")
    void adminCanManageEveryContentType(ResourceCase resource) throws Exception {
        String path = "/api/admin/" + resource.path();
        mvc.perform(get(path)).andExpect(status().isOk()).andExpect(jsonPath("$").isArray());

        MvcResult created = mvc.perform(post(path).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content(resource.createJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andReturn();
        long id = ((Number) JsonPath.read(created.getResponse().getContentAsString(), "$.id")).longValue();

        mvc.perform(get(path + "/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
        mvc.perform(put(path + "/" + id).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content(resource.updateJson()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$." + resource.updatedField()).value(resource.updatedValue()));
        mvc.perform(delete(path + "/" + id).with(csrf())).andExpect(status().isNoContent());
        mvc.perform(get(path + "/" + id)).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("not_found"));
    }

    @ParameterizedTest
    @MethodSource("resources")
    void unauthenticatedRequestsAreRejected(ResourceCase resource) throws Exception {
        String path = "/api/admin/" + resource.path();
        mvc.perform(get(path)).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("unauthorized"));
        mvc.perform(post(path).with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content(resource.createJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void nonAdminIsForbidden() throws Exception {
        mvc.perform(get("/api/admin/programs")).andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("forbidden"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void invalidAndMissingProgramsHaveClearErrors() throws Exception {
        mvc.perform(get("/api/admin/programs/" + Long.MAX_VALUE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("not_found"));
        mvc.perform(get("/api/admin/programs/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("invalid_id"));
        mvc.perform(get("/api/admin/programs/-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("invalid_request"));
        mvc.perform(post("/api/admin/programs").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DRAFT\",\"titleAz\":\" \",\"descriptionAz\":\"Description\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("validation_failed"));
        mvc.perform(post("/api/admin/programs").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{broken json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("invalid_json"));
        mvc.perform(post("/api/admin/programs").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DRAFT\",\"titleAz\":\"Test\",\"descriptionAz\":\"Test\"}"))
                .andExpect(status().isForbidden());
    }

    record ResourceCase(String path, String createJson, String updateJson,
            String updatedField, String updatedValue) {
    }
}
