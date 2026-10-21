package az.edu.azmiu.ibi.model;

import java.util.List;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "startups")
public class Startup extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "logo_text")
    private String logoText;

    @Column(name = "logo_color")
    private String logoColor;

    @Column(name = "tagline_az")
    private String taglineAz;

    @Column(name = "tagline_en")
    private String taglineEn;

    @Column(name = "stage_az")
    private String stageAz;

    @Column(name = "stage_en")
    private String stageEn;

    private Integer members;

    @Column(name = "description_az", nullable = false, columnDefinition = "text")
    private String descriptionAz;

    @Column(name = "description_en", columnDefinition = "text")
    private String descriptionEn;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, Object>> founders;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tech_stack", columnDefinition = "jsonb")
    private List<String> techStack;

    @Column(name = "traction_az", columnDefinition = "text")
    private String tractionAz;

    @Column(name = "traction_en", columnDefinition = "text")
    private String tractionEn;

    @Column(length = 2048)
    private String website;

    @Column(nullable = false)
    private boolean published;
}
