package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "program_applications")
public class ProgramApplication extends ApplicationEntity {

    @Column(name = "selected_program", nullable = false)
    private String selectedProgram;

    @Column(nullable = false)
    private String faculty;

    public void setSelectedProgram(String selectedProgram) { this.selectedProgram = selectedProgram; }
    public void setFaculty(String faculty) { this.faculty = faculty; }
}
