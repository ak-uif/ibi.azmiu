package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.StartupRequest;
import az.edu.azmiu.ibi.content.ContentDtos.StartupResponse;
import az.edu.azmiu.ibi.model.Startup;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class StartupService extends CrudService<Startup, StartupRequest, StartupResponse> {

    public StartupService(StartupRepository repository, Validator validator) {
        super(repository, Startup.class, StartupResponse.class, validator, "Startup");
    }
}
