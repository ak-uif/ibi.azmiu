package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.EventRequest;
import az.edu.azmiu.ibi.content.ContentDtos.EventResponse;
import az.edu.azmiu.ibi.model.Event;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class EventService extends CrudService<Event, EventRequest, EventResponse> {

    public EventService(EventRepository repository, Validator validator) {
        super(repository, Event.class, EventResponse.class, validator, "Event");
    }
}
