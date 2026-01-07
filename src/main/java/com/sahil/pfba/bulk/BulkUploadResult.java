package com.sahil.pfba.bulk;

import java.util.List;

import com.sahil.pfba.domain.Expense;

public class BulkUploadResult {

    private final List<Expense> validExpenses;
    private final List<BulkUploadError> errors;

    public BulkUploadResult(List<Expense> validExpenses,
        List<BulkUploadError> errors) {
    this.validExpenses = validExpenses;
    this.errors = errors;
    }

    public List<Expense> getValidExpenses() {
        return validExpenses;
    }

    public List<BulkUploadError> getErrors() {
        return errors;
    }

    
}
