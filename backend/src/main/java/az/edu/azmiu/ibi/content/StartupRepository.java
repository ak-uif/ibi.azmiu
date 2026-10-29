package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Startup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StartupRepository extends JpaRepository<Startup, Long> {
    List<Startup> findByPublishedTrueOrderByIdAsc();
}
