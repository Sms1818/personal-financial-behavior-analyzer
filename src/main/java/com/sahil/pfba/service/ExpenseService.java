package com.sahil.pfba.service;

import java.time.LocalDate;
import java.util.List;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;

public interface ExpenseService {
    Expense addExpense(Expense expense);
    List<Expense> getAllExpenses();
    List<Expense> getExpensesByCategory(Category category);
    List<Expense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate);
}
