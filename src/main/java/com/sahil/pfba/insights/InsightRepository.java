package com.sahil.pfba.insights;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightRepository
        extends JpaRepository<Insight, String> {

    List<Insight> findByStatus(InsightStatus status);

    List<Insight> findByType(InsightType type);

    default List<Insight> findActive() {
        return findByStatus(InsightStatus.ACTIVE);
    }

    default void updateInsightStatus(
            String insightId,
            InsightStatus status) {
        findById(insightId).ifPresent(existing -> {

            Insight updated = new Insight.Builder()
                    .id(existing.getId())
                    .type(existing.getType())
                    .severity(existing.getSeverity())
                    .status(status)
                    .message(existing.getMessage())
                    .explanation(existing.getExplanation())
                    .createdAt(existing.getCreatedAt())
                    .lastEvaluatedAt(java.time.LocalDateTime.now())
                    .build();

            save(updated);
        });
    }
}
