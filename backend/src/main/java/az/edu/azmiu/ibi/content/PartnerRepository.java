package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findByPublishedTrueOrderByIdAsc();
}
