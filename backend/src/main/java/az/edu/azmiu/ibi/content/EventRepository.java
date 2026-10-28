package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
