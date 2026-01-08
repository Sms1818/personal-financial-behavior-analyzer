package com.sahil.pfba.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;

@RestController
@RequestMapping("/api/audits")
public class ImportAuditController {
    private final ImportAuditService auditService;

    public ImportAuditController(ImportAuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImportAudit> getAudit(@PathVariable String id) {
        ImportAudit audit = auditService.findById(id)
        .orElseThrow(() -> new RuntimeException("Audit not found"));
        return ResponseEntity.ok(audit);
}
    
}
