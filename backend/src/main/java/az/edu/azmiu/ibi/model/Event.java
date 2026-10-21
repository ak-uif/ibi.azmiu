package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event extends BaseEntity {

    @Column(name = "day_label")
    private String dayLabel;

    @Column(name = "month_az")
    private String monthAz;

    @Column(name = "month_en")
    private String monthEn;

    @Column(name = "title_az", nullable = false)
    private String titleAz;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "location_az")
    private String locationAz;

    @Column(name = "location_en")
    private String locationEn;

    @Column(name = "time_az")
    private String timeAz;

    @Column(name = "time_en")
    private String timeEn;

    private String attendees;

    @Column(name = "speaker_az")
    private String speakerAz;

    @Column(name = "speaker_en")
    private String speakerEn;

    @Column(name = "description_az", nullable = false, columnDefinition = "text")
    private String descriptionAz;

    @Column(name = "description_en", columnDefinition = "text")
    private String descriptionEn;

    @Column(name = "details_az", columnDefinition = "text")
    private String detailsAz;

    @Column(name = "details_en", columnDefinition = "text")
    private String detailsEn;

    @Column(nullable = false)
    private boolean published;
}
