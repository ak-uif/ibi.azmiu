package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "programs")
public class Program extends BaseEntity {

    private String category;

    @Column(nullable = false)
    private String status;

    @Column(name = "title_az", nullable = false)
    private String titleAz;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "description_az", nullable = false, columnDefinition = "text")
    private String descriptionAz;

    @Column(name = "description_en", columnDefinition = "text")
    private String descriptionEn;

    @Column(name = "details_az", columnDefinition = "text")
    private String detailsAz;

    @Column(name = "details_en", columnDefinition = "text")
    private String detailsEn;

    @Column(name = "duration_az")
    private String durationAz;

    @Column(name = "duration_en")
    private String durationEn;

    @Column(name = "audience_az")
    private String audienceAz;

    @Column(name = "audience_en")
    private String audienceEn;

    @Column(name = "deadline_az")
    private String deadlineAz;

    @Column(name = "deadline_en")
    private String deadlineEn;

    @Column(name = "period_az")
    private String periodAz;

    @Column(name = "period_en")
    private String periodEn;

    private String icon;
}
