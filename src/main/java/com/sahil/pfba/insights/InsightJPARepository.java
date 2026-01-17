package com.sahil.pfba.insights;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightJPARepository extends JpaRepository<Insight,String>{
    Optional<Insight> findByTypeAndMessage(InsightType type, String message);

    List<Insight> findByStatus(InsightStatus status);

    List<Insight> findByType(InsightType type);
    
}
