package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.MentorRequest;
import az.edu.azmiu.ibi.content.ContentDtos.MentorResponse;
import az.edu.azmiu.ibi.model.Mentor;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class MentorService extends CrudService<Mentor, MentorRequest, MentorResponse> {

    public MentorService(MentorRepository repository, Validator validator) {
        super(repository, Mentor.class, MentorResponse.class, validator, "Mentor");
    }
}
