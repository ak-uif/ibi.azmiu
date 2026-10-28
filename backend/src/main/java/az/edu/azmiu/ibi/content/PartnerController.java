package az.edu.azmiu.ibi.content;

import java.net.URI;
import java.util.List;

import az.edu.azmiu.ibi.content.ContentDtos.PartnerRequest;
import az.edu.azmiu.ibi.content.ContentDtos.PartnerResponse;
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
@RequestMapping("/api/admin/partners")
public class PartnerController {

    private final PartnerService service;

    public PartnerController(PartnerService service) {
        this.service = service;
    }

    @GetMapping
    public List<PartnerResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public PartnerResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<PartnerResponse> create(@Valid @RequestBody PartnerRequest request) {
        PartnerResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/partners/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public PartnerResponse update(@PathVariable Long id, @Valid @RequestBody PartnerRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
