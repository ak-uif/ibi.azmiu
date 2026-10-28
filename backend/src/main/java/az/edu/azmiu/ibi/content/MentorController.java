package az.edu.azmiu.ibi.content;

import java.net.URI;
import java.util.List;

import az.edu.azmiu.ibi.content.ContentDtos.MentorRequest;
import az.edu.azmiu.ibi.content.ContentDtos.MentorResponse;
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
@RequestMapping("/api/admin/mentors")
public class MentorController {

    private final MentorService service;

    public MentorController(MentorService service) {
        this.service = service;
    }

    @GetMapping
    public List<MentorResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public MentorResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<MentorResponse> create(@Valid @RequestBody MentorRequest request) {
        MentorResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/mentors/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public MentorResponse update(@PathVariable Long id, @Valid @RequestBody MentorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
