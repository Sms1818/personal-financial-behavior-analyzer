package com.sahil.pfba.insights;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

@Repository
public class InsightRepository {
    private final Map<String, Insight> store= new ConcurrentHashMap<>();

    public void save(Insight insight){
        store.put(insight.getId(), insight);
    }

    public List<Insight> findAll(){
        return List.copyOf(store.values());
    }

    public Optional<Insight> findById(String id){
        return Optional.ofNullable(store.get(id));
    }

    public List<Insight> findByType(InsightType type){
        return store.values()
            .stream()
            .filter(insight->insight.getType()==type)
            .toList();
    }

   
    public List<Insight> findByStatus(InsightStatus status) {
        return store.values()
                .stream()
                .filter(i -> i.getStatus() == status)
                .toList();
    }


    public List<Insight> findActive(){
        return store.values()
            .stream()
            .filter(insight->insight.getStatus()==InsightStatus.ACTIVE)
            .toList();
    }

    public Optional<Insight> findByTypeAndMessage(InsightType type, String message){
        return store.values()
            .stream()
            .filter(insight->insight.getType()==type && insight.getMessage().equals(message))
            .findFirst();
    }

    public void updateInsightStatus(String insightId,InsightStatus status){
        Insight existing=store.get(insightId);
        if(existing==null){
            return;
        }
        Insight updated=new Insight.Builder()
                .id(existing.getId())
                .type(existing.getType())
                .status(status)
                .severity(existing.getSeverity())
                .message(existing.getMessage())
                .explanation(existing.getExplanation())
                .lastEvaluatedAt(LocalDateTime.now())
                .build();
        
        store.put(insightId,updated);
    }
    
}
