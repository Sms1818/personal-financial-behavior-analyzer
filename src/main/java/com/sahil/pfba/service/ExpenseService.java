package com.sahil.pfba.service;

import java.time.LocalDate;
import java.util.List;

import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;

public interface ExpenseService {

    Expense addExpense(String userId, Expense expense);

    List<Expense> getAllExpenses(String userId);

    List<Expense> getExpensesByCategory(
            String userId,
            Category category
    );

    List<Expense> getExpensesByDateRange(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );

    Expense updateExpense(
            String userId,
            String expenseId,
            UpdateExpenseRequest expense
    );

    void deleteExpense(String userId, String expenseId);

    List<Expense> getExpenseHistory(
            String userId,
            String expenseId
    );

    List<Expense> getExpensesByType(
            String userId,
            TransactionType type
    );


}
