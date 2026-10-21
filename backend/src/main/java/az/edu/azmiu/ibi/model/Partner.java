package az.edu.azmiu.ibi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "partners")
public class Partner extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String icon;

    @Column(nullable = false)
    private boolean published;
}
