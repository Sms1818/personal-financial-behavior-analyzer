package com.sahil.pfba.insights;

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

    public List<Insight> findActive(){
        return store.values()
            .stream()
            .filter(insight->insight.getStatus()==InsightStatus.ACTIVE)
            .toList();
    }
    
}
