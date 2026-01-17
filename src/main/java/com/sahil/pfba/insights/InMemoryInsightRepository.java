package com.sahil.pfba.insights;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;


@Repository
@Profile("dev")
public class InMemoryInsightRepository implements InsightRepository {

    private final Map<String, Insight> store = new ConcurrentHashMap<>();

    @Override
    public Insight save(Insight insight) {
        store.put(insight.getId(), insight);
        return insight;
    }

    @Override
    public Optional<Insight> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<Insight> findAll() {
        return List.copyOf(store.values());
    }

    @Override
    public List<Insight> findByType(InsightType type) {
        return store.values().stream()
                .filter(i -> i.getType() == type)
                .toList();
    }

    @Override
    public List<Insight> findByStatus(InsightStatus status) {
        return store.values().stream()
                .filter(i -> i.getStatus() == status)
                .toList();
    }

    @Override
    public List<Insight> findActive() {
        return findByStatus(InsightStatus.ACTIVE);
    }

    @Override
    public Optional<Insight> findByTypeAndMessage(
            InsightType type,
            String message
    ) {
        return store.values().stream()
                .filter(i ->
                        i.getType() == type &&
                        i.getMessage().equals(message)
                )
                .findFirst();
    }

    @Override
    public void updateInsightStatus(String insightId, InsightStatus status) {
        Insight existing = store.get(insightId);
        if (existing == null) return;

        Insight updated = new Insight.Builder()
                .id(existing.getId())
                .type(existing.getType())
                .severity(existing.getSeverity())
                .status(status)
                .message(existing.getMessage())
                .explanation(existing.getExplanation())
                .lastEvaluatedAt(LocalDateTime.now())
                .build();

        store.put(insightId, updated);
    }
}
