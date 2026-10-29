package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    @Query("select p from Program p where lower(p.status) in ('open', 'active', 'soon') order by p.id")
    List<Program> findPublicPrograms();
}
