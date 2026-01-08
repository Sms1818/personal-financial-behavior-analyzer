package com.sahil.pfba.audit;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class ImportAuditService {
    private final ImportAuditRepository auditRepository;

    public ImportAuditService(ImportAuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public ImportAudit startAudit(String filename, ImportType importType){
        ImportAudit audit=new ImportAudit.Builder()
            .id(UUID.randomUUID().toString())
            .fileName(filename)
            .importType(importType)
            .status(ImportStatus.STARTED)
            .startedAt(java.time.LocalDateTime.now())
            .build();
        
        auditRepository.save(audit);
        return audit;
    }

    public void completeAudit(ImportAudit audit, int total, int success, int failure){
        ImportAudit completed= new ImportAudit.Builder()
            .id(audit.getId())
            .fileName(audit.getFileName())
            .importType(audit.getImportType())
            .status(ImportStatus.COMPLETED)
            .totalRecords(total)
            .successCount(success)
            .failureCount(failure)
            .startedAt(audit.getStartedAt())
            .completedAt(java.time.LocalDateTime.now())
            .build();
        
        auditRepository.save(completed);

    }

    public void failAudit(ImportAudit audit) {
        ImportAudit failed = new ImportAudit.Builder()
                .id(audit.getId())
                .fileName(audit.getFileName())
                .importType(audit.getImportType())
                .status(ImportStatus.FAILED)
                .startedAt(audit.getStartedAt())
                .completedAt(LocalDateTime.now())
                .build();

        auditRepository.save(failed);
    }

    public Optional<ImportAudit> findById(String id) {
        return auditRepository.findById(id);
    }
}
