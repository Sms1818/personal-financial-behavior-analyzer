package com.sahil.pfba.insights;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("prod")
public class JPAInsightRepositoryAdapter implements InsightRepository {

    private final InsightJPARepository jpaRepository;

    public JPAInsightRepositoryAdapter(InsightJPARepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Insight save(Insight insight) {
        return jpaRepository.save(insight);
    }

    @Override
    public Optional<Insight> findById(String id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Insight> findByTypeAndMessage(
            InsightType type,
            String message
    ) {
        return jpaRepository.findByTypeAndMessage(type, message);
    }

    @Override
    public List<Insight> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Insight> findByType(InsightType type) {
        return jpaRepository.findByType(type);
    }

    @Override
    public List<Insight> findByStatus(InsightStatus status) {
        return jpaRepository.findByStatus(status);
    }

    @Override
    public List<Insight> findActive() {
        return jpaRepository.findByStatus(InsightStatus.ACTIVE);
    }

    @Override
    public void updateInsightStatus(String insightId, InsightStatus status) {
        jpaRepository.findById(insightId).ifPresent(existing -> {

            Insight updated = new Insight.Builder()
                    .id(existing.getId())
                    .type(existing.getType())
                    .severity(existing.getSeverity())
                    .status(status)
                    .message(existing.getMessage())
                    .explanation(existing.getExplanation())
                    .lastEvaluatedAt(LocalDateTime.now())
                    .build();

            jpaRepository.save(updated);
        });
}

}
