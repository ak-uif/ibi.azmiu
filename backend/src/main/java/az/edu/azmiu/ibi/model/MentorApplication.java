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

    @Column(name = "cv_storage_key", length = 2048)
    private String cvStorageKey;

    public void setCompanyRole(String companyRole) { this.companyRole = companyRole; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public void setBio(String bio) { this.bio = bio; }
    public void setCvStorageKey(String cvStorageKey) { this.cvStorageKey = cvStorageKey; }
    public String getCvStorageKey() { return cvStorageKey; }
    public String getCompanyRole() { return companyRole; }
    public String getExpertise() { return expertise; }
    public String getLinkedin() { return linkedin; }
    public String getBio() { return bio; }
}
