package com.sahil.pfba.insights;

import java.util.List;
import java.util.Optional;

public interface InsightRepository {

    Insight save(Insight insight);

    Optional<Insight> findById(String id);

    Optional<Insight> findByTypeAndMessage(
            InsightType type,
            String message
    );

    List<Insight> findAll();

    List<Insight> findByType(InsightType type);

    List<Insight> findByStatus(InsightStatus status);

    List<Insight> findActive();

    void updateInsightStatus(String insightId, InsightStatus status);
}
