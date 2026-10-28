package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.ProgramRequest;
import az.edu.azmiu.ibi.content.ContentDtos.ProgramResponse;
import az.edu.azmiu.ibi.model.Program;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class ProgramService extends CrudService<Program, ProgramRequest, ProgramResponse> {

    public ProgramService(ProgramRepository repository, Validator validator) {
        super(repository, Program.class, ProgramResponse.class, validator, "Program");
    }
}
