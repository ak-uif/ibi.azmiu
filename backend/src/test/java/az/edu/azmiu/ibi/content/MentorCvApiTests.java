package az.edu.azmiu.ibi.content;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MentorCvApiTests {
    private static final Path STORAGE = Path.of(System.getProperty("java.io.tmpdir"),
            "ibi-mentor-cv-test-" + UUID.randomUUID());
    private static final String BODY = "{\"fullName\":\"CV Test\",\"email\":\"cv-test@example.com\","
            + "\"phone\":\"+994 50 000 00 00\",\"companyRole\":\"Designer\","
            + "\"expertise\":\"design\",\"linkedin\":\"https://linkedin.com/in/example\","
            + "\"bio\":\"Mentor experience\"}";

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @DynamicPropertySource
    static void storage(DynamicPropertyRegistry registry) {
        registry.add("CV_STORAGE_DIR", STORAGE::toString);
    }

    @AfterAll
    static void removeTestFiles() throws IOException {
        if (!Files.exists(STORAGE)) return;
        try (var files = Files.list(STORAGE)) {
            for (Path file : files.toList()) Files.delete(file);
        }
        Files.delete(STORAGE);
    }

    @Test
    void mentorCanSubmitWithoutCv() throws Exception {
        mvc.perform(multipart("/api/public/applications/mentors").file(application()))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("submitted"));
        Long id = lastId();
        assertEquals(null, jdbc.queryForObject("SELECT cv_storage_key FROM mentor_applications WHERE id = ?", String.class, id));
        mvc.perform(get("/api/admin/mentor-applications/" + id + "/cv")
                .with(user("admin").roles("ADMIN"))).andExpect(status().isNotFound());
    }

    @Test
    void validPdfDocAndDocxAreStoredAndAdminOnly() throws Exception {
        byte[] pdf = "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF".getBytes(StandardCharsets.US_ASCII);
        byte[] doc = new byte[512];
        byte[] header = new byte[]{(byte) 0xd0, (byte) 0xcf, 0x11, (byte) 0xe0,
                (byte) 0xa1, (byte) 0xb1, 0x1a, (byte) 0xe1};
        System.arraycopy(header, 0, doc, 0, header.length);
        doc[28] = (byte) 0xfe;
        doc[29] = (byte) 0xff;
        doc[30] = 9;
        checkValid("cv.pdf", "application/pdf", pdf);
        checkValid("cv.doc", "application/msword", doc);
        checkValid("cv.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docx());
    }

    private void checkValid(String filename, String type, byte[] bytes) throws Exception {
        mvc.perform(multipart("/api/public/applications/mentors").file(application())
                .file(new MockMultipartFile("cv", filename, type, bytes)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("submitted"));
        Long id = lastId();
        String key = jdbc.queryForObject("SELECT cv_storage_key FROM mentor_applications WHERE id = ?", String.class, id);
        assertNotNull(key);
        assertTrue(key.matches("[0-9a-f]{32}\\.(pdf|doc|docx)"));
        assertFalse(key.contains(filename));
        assertTrue(Files.isRegularFile(STORAGE.resolve(key)));
        assertEquals("NEW", jdbc.queryForObject("SELECT status FROM mentor_applications WHERE id = ?", String.class, id));
        mvc.perform(get("/api/admin/mentor-applications/" + id + "/cv"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/mentor-applications"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/public/applications/mentors/" + id + "/cv"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/admin/mentor-applications/" + id + "/cv")
                .with(user("visitor").roles("USER"))).andExpect(status().isForbidden());
        byte[] downloaded = mvc.perform(get("/api/admin/mentor-applications/" + id + "/cv")
                .with(user("admin").roles("ADMIN"))).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();
        assertArrayEquals(bytes, downloaded);
        mvc.perform(get("/api/admin/mentor-applications/" + id)
                .with(user("admin").roles("ADMIN"))).andExpect(jsonPath("$.hasCv").value(true));
    }

    @Test
    void rejectsUnsupportedSpoofedEmptyAndOversizedFiles() throws Exception {
        reject("cv.exe", "application/octet-stream", new byte[]{1}, "invalid_upload");
        reject("cv.pdf", "text/plain", "%PDF-1.4\n%%EOF".getBytes(StandardCharsets.US_ASCII), "invalid_upload");
        reject("cv.pdf", "application/pdf", "not a pdf".getBytes(StandardCharsets.US_ASCII), "invalid_upload");
        reject("cv.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                new byte[]{'P', 'K', 3, 4, 1}, "invalid_upload");
        reject("cv.pdf", "application/pdf", new byte[0], "invalid_upload");
        reject("cv.pdf", "application/pdf", new byte[5 * 1024 * 1024 + 1], "invalid_upload");
        mvc.perform(multipart("/api/public/applications/mentors")
                .file(new MockMultipartFile("cv", "cv.pdf", "application/pdf", new byte[]{1})))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("invalid_upload"));
    }

    private void reject(String filename, String type, byte[] bytes, String code) throws Exception {
        Integer before = jdbc.queryForObject("SELECT count(*) FROM mentor_applications", Integer.class);
        mvc.perform(multipart("/api/public/applications/mentors").file(application())
                .file(new MockMultipartFile("cv", filename, type, bytes)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value(code));
        assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM mentor_applications", Integer.class));
    }

    private Long lastId() {
        return jdbc.queryForObject("SELECT id FROM mentor_applications WHERE email = ? ORDER BY id DESC LIMIT 1",
                Long.class, "cv-test@example.com");
    }

    private static MockMultipartFile application() {
        return new MockMultipartFile("application", "", MediaType.APPLICATION_JSON_VALUE,
                BODY.getBytes(StandardCharsets.UTF_8));
    }

    private static byte[] docx() throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try (ZipOutputStream zip = new ZipOutputStream(output)) {
            for (String name : new String[]{"[Content_Types].xml", "word/document.xml"}) {
                zip.putNextEntry(new ZipEntry(name));
                zip.write("<xml/>".getBytes(StandardCharsets.UTF_8));
                zip.closeEntry();
            }
        }
        return output.toByteArray();
    }
}
