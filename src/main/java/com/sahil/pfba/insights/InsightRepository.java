package com.sahil.pfba.insights;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightRepository
        extends JpaRepository<Insight, String> {

    List<Insight> findByStatus(InsightStatus status);

    List<Insight> findByType(InsightType type);
}
