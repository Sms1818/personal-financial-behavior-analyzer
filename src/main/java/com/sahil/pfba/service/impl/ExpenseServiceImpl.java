package com.sahil.pfba.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import com.sahil.pfba.analysis.SpendingAnalysisService;
import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.exception.InvalidExpenseOperationException;
import com.sahil.pfba.repository.ExpenseJPARepository;
import com.sahil.pfba.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseJPARepository expenseRepository;
    private final SpendingAnalysisService spendingAnalysisService;

    public ExpenseServiceImpl(ExpenseJPARepository expenseRepository,SpendingAnalysisService spendingAnalysisService) {
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
        return expenseRepository.findByDateBetween(start, end);
    }


    @Override
    public CompletableFuture<BigDecimal> analyzeTotalSpendingAsync(){
        // Analysis always runs on latest ACTIVE expense versions only
        List<Expense> expenses=getAllExpenses();
        return spendingAnalysisService.calculateTotalSpending(expenses);
    }

    @Override
    public Expense updateExpense(String id, UpdateExpenseRequest request){
        Expense existing=expenseRepository.findById(id).orElseThrow(()->new RuntimeException("Expense not found"));

        if(existing.getStatus()==ExpenseStatus.DELETED){
            throw new InvalidExpenseOperationException("Cannot update a deleted expense");
        }

        Expense updated=new Expense.Builder()
            .id(existing.getId())
            .description(request.description)
            .amount(request.amount)
            .category(request.category)
            .date(request.date)
            .status(existing.getStatus())
            .version(existing.getVersion()+1)
            .build();
        
        return expenseRepository.save(updated);

    }

    @Override
    public void deleteExpense(String id){
        Expense existing=expenseRepository.findById(id).orElseThrow(()->new RuntimeException("Expense not found"));
        if(existing.getStatus()==ExpenseStatus.DELETED){
            return;
        }

        Expense deleted=new Expense.Builder()
            .id(existing.getId())
            .description(existing.getDescription())
            .amount(existing.getAmount())
            .category(existing.getCategory())
            .date(existing.getDate())
            .status(ExpenseStatus.DELETED)
            .build();
        
        expenseRepository.save(deleted);
    }

    @Override
    public List<Expense> getExpenseHistory(String id){
        return List.of();
    }

    @Override
    public void saveAllExpenses(List<Expense> expenses) {
        if (expenses == null || expenses.isEmpty()) {
            return;
        }
        expenseRepository.saveAll(expenses);
    }

}
