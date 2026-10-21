package az.edu.azmiu.ibi.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "mentors")
public class Mentor extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "role_az")
    private String roleAz;

    @Column(name = "role_en")
    private String roleEn;

    private String category;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> skills;

    @Column(name = "avatar_url", length = 2048)
    private String avatarUrl;

    @Column(name = "linkedin_url", length = 2048)
    private String linkedinUrl;

    @Column(name = "github_url", length = 2048)
    private String githubUrl;

    @Column(nullable = false)
    private boolean published;
}
