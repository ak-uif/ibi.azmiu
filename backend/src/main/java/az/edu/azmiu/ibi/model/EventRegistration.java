package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "event_registrations")
public class EventRegistration extends ApplicationEntity {

    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @Column(nullable = false)
    private String format;
}
