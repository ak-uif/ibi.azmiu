package az.edu.azmiu.ibi.content;

import java.net.URI;
import java.util.List;

import az.edu.azmiu.ibi.content.ContentDtos.ProgramRequest;
import az.edu.azmiu.ibi.content.ContentDtos.ProgramResponse;
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
@RequestMapping("/api/admin/programs")
public class ProgramController {

    private final ProgramService service;

    public ProgramController(ProgramService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProgramResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public ProgramResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<ProgramResponse> create(@Valid @RequestBody ProgramRequest request) {
        ProgramResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/programs/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public ProgramResponse update(@PathVariable Long id, @Valid @RequestBody ProgramRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
