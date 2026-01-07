package com.sahil.pfba.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;

public interface ExpenseService {
    Expense addExpense(Expense expense);
    List<Expense> getAllExpenses();
    List<Expense> getExpensesByCategory(Category category);
    List<Expense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate);
    Expense updateExpense(String id, UpdateExpenseRequest expense);
    CompletableFuture<BigDecimal> analyzeTotalSpendingAsync();
    void deleteExpense(String id);
    List<Expense> getExpenseHistory(String id);
    void saveAllExpenses(List<Expense> expenses);
    

}
