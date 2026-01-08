package com.sahil.pfba.bulk;

import java.util.List;

import com.sahil.pfba.domain.Expense;

public class BulkUploadResult {
    private final int totalRecords;
    private final List<Expense> validExpenses;
    private final List<BulkUploadError> errors;

    public BulkUploadResult(int totalRecords,List<Expense> validExpenses,
    List<BulkUploadError> errors) {
        this.totalRecords = totalRecords;
        this.validExpenses = validExpenses;
        this.errors = errors;
    }
    public int getTotalRecords() {
        return totalRecords;
    }

    public List<Expense> getValidExpenses() {
        return validExpenses;
    }

    public List<BulkUploadError> getErrors() {
        return errors;
    }

    
}
