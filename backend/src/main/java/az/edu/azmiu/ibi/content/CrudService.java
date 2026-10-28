package az.edu.azmiu.ibi.content;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public abstract class CrudService<E, Q, R> {

    private final JpaRepository<E, Long> repository;
    private final Class<E> entityType;
    private final Class<R> responseType;
    private final Validator validator;
    private final String resource;

    protected CrudService(JpaRepository<E, Long> repository, Class<E> entityType,
            Class<R> responseType, Validator validator, String resource) {
        this.repository = repository;
        this.entityType = entityType;
        this.responseType = responseType;
        this.validator = validator;
        this.resource = resource;
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
        return response(repository.save(entity));
    }

    public R update(Long id, Q request) {
        validate(request);
        E entity = find(id);
        ContentMapper.copyRequest(request, entity);
        return response(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(find(id));
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
