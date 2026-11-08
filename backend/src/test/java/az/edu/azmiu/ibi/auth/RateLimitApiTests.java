package az.edu.azmiu.ibi.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"PUBLIC_FORM_RATE_LIMIT=1", "LOGIN_RATE_LIMIT=1"})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RateLimitApiTests {
    @Autowired MockMvc mvc;

    @Test
    void repeatPublicSubmissionGetsRateLimitResponse() throws Exception {
        String body = "{}";
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isBadRequest());
        mvc.perform(post("/api/public/applications/programs").contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code").value("rate_limited"));
    }

    @Test
    void repeatLoginGetsRateLimitResponse() throws Exception {
        String body = "{\"username\":\"unknown\",\"password\":\"wrong\"}";
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code").value("rate_limited"));
    }
}
