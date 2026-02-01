package com.sahil.pfba.repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;

public interface ExpenseRepository {

    Expense save(Expense expense);

    List<Expense> findAllByUser(String userId);

    Optional<Expense> findLatestById(String userId, String expenseId);

    List<Expense> findHistoryById(String userId, String expenseId);

    List<Expense> findByCategory(String userId, Category category);

    List<Expense> findByDateRange(String userId, LocalDate start, LocalDate end);

    List<Expense> findByType(String userId, TransactionType type);

    void saveAll(String userId,List<Expense> expenses);
}
