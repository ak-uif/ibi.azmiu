package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    List<Mentor> findByPublishedTrueOrderByIdAsc();
}
