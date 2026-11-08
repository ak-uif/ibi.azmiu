package az.edu.azmiu.ibi.content;

import java.time.Instant;
import java.util.List;

import az.edu.azmiu.ibi.activity.AdminActivityService;
import az.edu.azmiu.ibi.model.MentorApplication;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/mentor-applications")
public class AdminMentorApplicationController {
    private final MentorApplicationRepository repository;
    private final MentorCvStorage storage;
    private final AdminActivityService activity;

    public AdminMentorApplicationController(MentorApplicationRepository repository, MentorCvStorage storage,
            AdminActivityService activity) {
        this.repository = repository;
        this.storage = storage;
        this.activity = activity;
    }

    @GetMapping
    public List<Summary> list() {
        return repository.findAll().stream().map(entity -> new Summary(
                entity.getId(), entity.getFullName(), entity.getCreatedAt(), entity.getCvStorageKey() != null)).toList();
    }

    @GetMapping("/{id}")
    public Detail detail(@PathVariable Long id) {
        MentorApplication entity = find(id);
        Detail result = new Detail(entity.getId(), entity.getFullName(), entity.getEmail(), entity.getPhone(),
                entity.getCompanyRole(), entity.getExpertise(), entity.getLinkedin(), entity.getBio(),
                entity.getStatus(), entity.getCreatedAt(), entity.getCvStorageKey() != null);
        activity.recordSuccess("APPLICATION_VIEWED", "mentor_application", id, null);
        return result;
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        MentorCvStorage.StoredCv cv = storage.read(find(id).getCvStorageKey());
        activity.recordSuccess("CV_DOWNLOADED", "mentor_application", id, null);
        return ResponseEntity.ok()
                .contentType(cv.type())
                .contentLength(cv.bytes().length)
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("mentor-cv." + cv.extension()).build().toString())
                .header("X-Content-Type-Options", "nosniff")
                .body(cv.bytes());
    }

    private MentorApplication find(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecordNotFoundException("Mentor application"));
    }

    public record Summary(Long id, String fullName, Instant createdAt, boolean hasCv) {}
    public record Detail(Long id, String fullName, String email, String phone, String companyRole,
            String expertise, String linkedin, String bio, String status, Instant createdAt, boolean hasCv) {}
}
