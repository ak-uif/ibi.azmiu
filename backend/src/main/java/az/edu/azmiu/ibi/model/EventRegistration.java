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

    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public void setFormat(String format) { this.format = format; }
    public String getEventTitle() { return eventTitle; }
    public String getFormat() { return format; }
}
