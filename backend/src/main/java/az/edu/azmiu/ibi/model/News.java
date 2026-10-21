package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "news")
public class News extends BaseEntity {

    @Column(name = "category_az")
    private String categoryAz;

    @Column(name = "category_en")
    private String categoryEn;

    @Column(name = "date_az")
    private String dateAz;

    @Column(name = "date_en")
    private String dateEn;

    @Column(name = "title_az", nullable = false)
    private String titleAz;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "summary_az", columnDefinition = "text")
    private String summaryAz;

    @Column(name = "summary_en", columnDefinition = "text")
    private String summaryEn;

    @Column(name = "full_text_az", columnDefinition = "text")
    private String fullTextAz;

    @Column(name = "full_text_en", columnDefinition = "text")
    private String fullTextEn;

    @Column(name = "image_url", length = 2048)
    private String imageUrl;

    @Column(nullable = false)
    private boolean published;
}
