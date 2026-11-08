package az.edu.azmiu.ibi.content;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Locale;

import az.edu.azmiu.ibi.activity.AdminActivityService;
import az.edu.azmiu.ibi.model.BaseEntity;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public abstract class CrudService<E extends BaseEntity, Q, R> {

    private final JpaRepository<E, Long> repository;
    private final Class<E> entityType;
    private final Class<R> responseType;
    private final Validator validator;
    private final String resource;
    private final AdminActivityService activity;

    protected CrudService(JpaRepository<E, Long> repository, Class<E> entityType,
            Class<R> responseType, Validator validator, String resource, AdminActivityService activity) {
        this.repository = repository;
        this.entityType = entityType;
        this.responseType = responseType;
        this.validator = validator;
        this.resource = resource;
        this.activity = activity;
    }

    @Transactional(readOnly = true)
    public List<R> list() {
        return repository.findAll(Sort.by("id")).stream().map(this::response).toList();
    }

    @Transactional(readOnly = true)
    public R get(Long id) {
        return response(find(id));
    }

    public R create(Q request) {
        validate(request);
        E entity = newEntity();
        ContentMapper.copyRequest(request, entity);
        E saved = repository.saveAndFlush(entity);
        activity.recordChange("CONTENT_CREATED", recordType(), saved.getId(), null);
        return response(saved);
    }

    public R update(Long id, Q request) {
        validate(request);
        E entity = find(id);
        String previous = state(response(entity));
        ContentMapper.copyRequest(request, entity);
        E saved = repository.saveAndFlush(entity);
        String current = state(response(saved));
        activity.recordChange(classify(previous, current), recordType(), saved.getId(), null);
        return response(saved);
    }

    public void delete(Long id) {
        E entity = find(id);
        repository.delete(entity);
        repository.flush();
        activity.recordChange("CONTENT_DELETED", recordType(), id, null);
    }

    private String recordType() { return resource.toLowerCase(Locale.ROOT); }

    private static String state(Object response) {
        if (response instanceof ContentDtos.ProgramResponse item) return item.status();
        if (response instanceof ContentDtos.EventResponse item) return String.valueOf(item.published());
        if (response instanceof ContentDtos.NewsResponse item) return String.valueOf(item.published());
        if (response instanceof ContentDtos.MentorResponse item) return String.valueOf(item.published());
        if (response instanceof ContentDtos.StartupResponse item) return String.valueOf(item.published());
        if (response instanceof ContentDtos.PartnerResponse item) return String.valueOf(item.published());
        throw new IllegalStateException("Unknown content response");
    }

    private static String classify(String previous, String current) {
        previous = previous.toLowerCase(Locale.ROOT);
        current = current.toLowerCase(Locale.ROOT);
        if (previous.equals(current)) return "CONTENT_UPDATED";
        if (current.equals("archived")) return "CONTENT_ARCHIVED";
        if (previous.equals("archived")) return "CONTENT_RESTORED";
        if (current.equals("true") || (previous.equals("draft") && !current.equals("draft"))) {
            return "CONTENT_PUBLISHED";
        }
        if (current.equals("false") || current.equals("draft")) return "CONTENT_UNPUBLISHED";
        return "CONTENT_UPDATED";
    }

    private E find(Long id) {
        if (id == null || id <= 0) {
            throw new InvalidContentException("ID must be a positive number");
        }
        return repository.findById(id).orElseThrow(() -> new RecordNotFoundException(resource));
    }

    private void validate(Q request) {
        if (request == null) {
            throw new InvalidContentException("Request body is required");
        }
        ConstraintViolation<Q> violation = validator.validate(request).stream().findFirst().orElse(null);
        if (violation != null) {
            throw new InvalidContentException(violation.getPropertyPath() + ": " + violation.getMessage());
        }
    }

    private E newEntity() {
        try {
            return entityType.getDeclaredConstructor().newInstance();
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException
                | NoSuchMethodException exception) {
            throw new IllegalStateException("Content creation failed", exception);
        }
    }

    private R response(E entity) {
        return ContentMapper.response(entity, responseType);
    }
}
