package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.PartnerRequest;
import az.edu.azmiu.ibi.content.ContentDtos.PartnerResponse;
import az.edu.azmiu.ibi.model.Partner;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class PartnerService extends CrudService<Partner, PartnerRequest, PartnerResponse> {

    public PartnerService(PartnerRepository repository, Validator validator) {
        super(repository, Partner.class, PartnerResponse.class, validator, "Partner");
    }
}
