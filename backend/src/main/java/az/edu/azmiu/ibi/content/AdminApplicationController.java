package az.edu.azmiu.ibi.content;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import az.edu.azmiu.ibi.activity.AdminActivityService;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {
    private final AdminApplicationService service;
    private final AdminActivityService activity;

    public AdminApplicationController(AdminApplicationService service, AdminActivityService activity) {
        this.service = service;
        this.activity = activity;
    }

    @GetMapping
    public AdminApplicationService.PageResult list(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") String page,
            @RequestParam(defaultValue = "20") String size) {
        return service.list(service.filters(type, status, search, sort, page, size));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "newest") String sort) {
        String csv = service.csv(service.filters(type, status, search, sort, "0", "20"));
        activity.recordSuccess("APPLICATIONS_EXPORTED", "applications", null, null);
        return ResponseEntity.ok()
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("applications.csv").build().toString())
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/{type}/{id}")
    public Map<String, Object> detail(@PathVariable String type, @PathVariable Long id) {
        Map<String, Object> result = service.detail(type, id);
        activity.recordSuccess("APPLICATION_VIEWED", AdminApplicationService.applicationType(type), id, null);
        return result;
    }

    @PatchMapping("/{type}/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable String type, @PathVariable Long id,
            @RequestBody StatusRequest request) {
        return service.updateStatus(type, id, request.status());
    }

    public record StatusRequest(String status) {}
}
