package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByPublishedTrueOrderByIdAsc();
}
