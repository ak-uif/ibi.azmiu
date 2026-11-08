package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "startup_applications")
public class StartupApplication extends ApplicationEntity {

    @Column(name = "startup_title", nullable = false)
    private String startupTitle;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    public void setStartupTitle(String startupTitle) { this.startupTitle = startupTitle; }
    public void setStage(String stage) { this.stage = stage; }
    public void setDescription(String description) { this.description = description; }
    public String getStartupTitle() { return startupTitle; }
    public String getStage() { return stage; }
    public String getDescription() { return description; }
}
