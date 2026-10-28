package az.edu.azmiu.ibi.content;

import java.net.URI;
import java.util.List;

import az.edu.azmiu.ibi.content.ContentDtos.StartupRequest;
import az.edu.azmiu.ibi.content.ContentDtos.StartupResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/startups")
public class StartupController {

    private final StartupService service;

    public StartupController(StartupService service) {
        this.service = service;
    }

    @GetMapping
    public List<StartupResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public StartupResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<StartupResponse> create(@Valid @RequestBody StartupRequest request) {
        StartupResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/startups/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public StartupResponse update(@PathVariable Long id, @Valid @RequestBody StartupRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
