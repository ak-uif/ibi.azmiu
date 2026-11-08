package az.edu.azmiu.ibi.activity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/activity")
public class AdminActivityController {
    private final AdminActivityService service;

    public AdminActivityController(AdminActivityService service) {
        this.service = service;
    }

    @GetMapping
    public AdminActivityService.PageResult list(
            @RequestParam(defaultValue = "") String action,
            @RequestParam(defaultValue = "") String admin,
            @RequestParam(defaultValue = "") String from,
            @RequestParam(defaultValue = "") String to,
            @RequestParam(defaultValue = "") String recordType,
            @RequestParam(defaultValue = "") String recordId,
            @RequestParam(defaultValue = "0") String page,
            @RequestParam(defaultValue = "20") String size) {
        return service.list(service.filters(action, admin, from, to, recordType, recordId, page, size));
    }
}
