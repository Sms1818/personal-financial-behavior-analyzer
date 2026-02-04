package com.sahil.pfba.bulk;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.metrics.ApplicationMetrics;
import com.sahil.pfba.repository.ExpenseRepository;

@Service
public class ExpenseImportProcessor {

    private final ExpenseRepository repository;
    private final ImportAuditService auditService;
    private final ApplicationMetrics metrics;

    public ExpenseImportProcessor(
            ExpenseRepository repository,
            ImportAuditService auditService,
            ApplicationMetrics metrics) {

        this.repository = repository;
        this.auditService = auditService;
        this.metrics = metrics;
    }

    @Transactional
    public void process(
            BulkUploadResult result,
            ImportAudit audit,
            String userId) {

        int savedCount=0;

        for (Expense expense : result.getValidExpenses()) {
            repository.save(expense);
            metrics.expenseCreated();
            savedCount++;
        }

        if(savedCount>0){
            metrics.csvUploaded();
        }

        auditService.completeAudit(
                audit,
                result.getTotalRecords(),
                result.getValidExpenses().size(),
                result.getErrors().size()
        );
    }
}
