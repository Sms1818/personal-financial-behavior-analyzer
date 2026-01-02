package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;

public interface ExpenseRepository {
    Expense save(Expense expense);
    List<Expense> findAll();
    List<Expense> findByCategory(Category category);
    List<Expense> findByDateRange(LocalDate start, LocalDate end);
}
