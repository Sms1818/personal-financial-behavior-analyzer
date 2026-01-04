package com.sahil.pfba.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import com.sahil.pfba.analysis.SpendingAnalysisService;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.repository.ExpenseRepository;
import com.sahil.pfba.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final SpendingAnalysisService spendingAnalysisService;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,SpendingAnalysisService spendingAnalysisService) {
        this.expenseRepository = expenseRepository;
        this.spendingAnalysisService = spendingAnalysisService;
    }

    @Override
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses(){
        return expenseRepository.findAll();
    }

    @Override
    public List<Expense> getExpensesByCategory(Category category) {
        return expenseRepository.findByCategory(category);
    }

    @Override
    public List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateRange(start, end);
    }

    @Override
    public CompletableFuture<BigDecimal> analyzeTotalSpendingAsync(){
        List<Expense> expenses=getAllExpenses();
        return spendingAnalysisService.calculateTotalSpending(expenses);
    }
    
}
