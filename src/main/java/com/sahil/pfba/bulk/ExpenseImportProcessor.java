package com.sahil.pfba.bulk;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.repository.ExpenseRepository;

@Service
public class ExpenseImportProcessor {

    private final ExpenseRepository repository;
    private final ImportAuditService auditService;

    public ExpenseImportProcessor(
            ExpenseRepository repository,
            ImportAuditService auditService) {

        this.repository = repository;
        this.auditService = auditService;
    }

    @Transactional
    public void process(
            BulkUploadResult result,
            ImportAudit audit,
            String userId) {

        for (Expense expense : result.getValidExpenses()) {
            repository.save(expense);
        }

        auditService.completeAudit(
                audit,
                result.getTotalRecords(),
                result.getValidExpenses().size(),
                result.getErrors().size()
        );
    }
}
