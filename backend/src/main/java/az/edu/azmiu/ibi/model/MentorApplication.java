package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "mentor_applications")
public class MentorApplication extends ApplicationEntity {

    @Column(name = "company_role", nullable = false)
    private String companyRole;

    @Column(nullable = false)
    private String expertise;

    @Column(nullable = false, length = 2048)
    private String linkedin;

    @Column(nullable = false, columnDefinition = "text")
    private String bio;

    @Column(name = "cv_url", length = 2048)
    private String cvUrl;
}
