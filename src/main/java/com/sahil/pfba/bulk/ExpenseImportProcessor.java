package com.sahil.pfba.bulk;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;
import com.sahil.pfba.service.ExpenseService;

@Service
public class ExpenseImportProcessor {

    private final ExpenseService expenseService;
    private final ImportAuditService auditService;

    public ExpenseImportProcessor(ExpenseService expenseService, ImportAuditService auditService){
        this.expenseService=expenseService;
        this.auditService=auditService;
    }

    @Transactional
    public void process(BulkUploadResult result, ImportAudit audit) {
        try {
            expenseService.saveAllExpenses(result.getValidExpenses());
            auditService.completeAudit(
                audit,
                result.getTotalRecords(),
                result.getValidExpenses().size(),
                result.getErrors().size()
            );
        } catch (Exception e) {
            auditService.failAudit(audit);
            throw e;
        }
    }
}
