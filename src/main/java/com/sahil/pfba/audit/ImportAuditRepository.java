package com.sahil.pfba.audit;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

@Repository
public class ImportAuditRepository {
    private final Map<String,ImportAudit> auditStore = new ConcurrentHashMap<>();

    public void save(ImportAudit audit){
        auditStore.put(audit.getId(), audit);
    }

    public Optional<ImportAudit> findById(String id){
        return Optional.ofNullable(auditStore.get(id));
    }
    
}
