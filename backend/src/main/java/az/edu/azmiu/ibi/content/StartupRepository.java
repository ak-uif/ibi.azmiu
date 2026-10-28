package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Startup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StartupRepository extends JpaRepository<Startup, Long> {
}
