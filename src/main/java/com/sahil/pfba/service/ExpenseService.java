package com.sahil.pfba.service;

import java.time.LocalDate;
import java.util.List;

import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;

public interface ExpenseService {
    Expense addExpense(Expense expense);
    List<Expense> getAllExpenses();
    List<Expense> getExpensesByCategory(Category category);
    List<Expense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate);
    Expense updateExpense(String id, UpdateExpenseRequest expense);
    void deleteExpense(String id);
    List<Expense> getExpenseHistory(String id);
    void saveAllExpenses(List<Expense> expenses);
    List<Expense> getExpensesByType(TransactionType type);

}
