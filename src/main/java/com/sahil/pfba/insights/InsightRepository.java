package com.sahil.pfba.insights;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightRepository
        extends JpaRepository<Insight, String> {

    List<Insight> findByUserId(String userId);

    List<Insight> findByUserIdAndStatus(
            String userId,
            InsightStatus status
    );

    List<Insight> findByUserIdAndType(
            String userId,
            InsightType type
    );

    Optional<Insight> findByIdAndUserId(
            String id,
            String userId
    );
}
