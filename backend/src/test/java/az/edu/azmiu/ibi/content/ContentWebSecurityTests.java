package az.edu.azmiu.ibi.content;

import java.util.List;

import az.edu.azmiu.ibi.auth.AdminUserRepository;
import az.edu.azmiu.ibi.auth.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProgramController.class)
@Import(SecurityConfig.class)
class ContentWebSecurityTests {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProgramService service;

    @MockitoBean
    private AdminUserRepository adminUserRepository;

    @Test
    void guestCannotListPrograms() throws Exception {
        mvc.perform(get("/api/admin/programs"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("unauthorized"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void nonAdminCannotListPrograms() throws Exception {
        mvc.perform(get("/api/admin/programs"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("forbidden"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminGetsListAndSafeClientErrors() throws Exception {
        when(service.list()).thenReturn(List.of());
        when(service.get(anyLong())).thenThrow(new RecordNotFoundException("Program"));
        mvc.perform(get("/api/admin/programs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
        mvc.perform(get("/api/admin/programs/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("not_found"));
        mvc.perform(get("/api/admin/programs/invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("invalid_id"));
        mvc.perform(post("/api/admin/programs").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DRAFT\",\"titleAz\":\" \",\"descriptionAz\":\"Description\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("validation_failed"));
        mvc.perform(post("/api/admin/programs").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{broken"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("invalid_json"));
        mvc.perform(post("/api/admin/programs").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DRAFT\",\"titleAz\":\"Test\",\"descriptionAz\":\"Test\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void unexpectedFailureDoesNotExposeInternalDetails() throws Exception {
        when(service.list()).thenThrow(new IllegalStateException("private internal detail"));
        mvc.perform(get("/api/admin/programs"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("internal_error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"));
    }
}
