package com.sahil.pfba.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.exception.InvalidExpenseOperationException;
import com.sahil.pfba.repository.ExpenseRepository;
import com.sahil.pfba.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    
    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
        
    }

    @Override
    @Transactional
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses() {
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
    @Transactional
    public Expense updateExpense(String id, UpdateExpenseRequest request) {
        Expense existing = expenseRepository.findLatestById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (existing.getStatus() == ExpenseStatus.DELETED) {
            throw new InvalidExpenseOperationException("Cannot update a deleted expense");
        }

        Expense updated = new Expense.Builder()
                .id(existing.getId())
                .description(request.description)
                .amount(request.amount)
                .category(request.category)
                .date(request.date)
                .status(existing.getStatus())
                .version(existing.getVersion() + 1)
                .transactionType(existing.getTransactionType())
                .createdAt(LocalDateTime.now())
                .build();

        return expenseRepository.save(updated);

    }

    @Override
    @Transactional
    public void deleteExpense(String id) {
        Expense existing = expenseRepository.findLatestById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (existing.getStatus() == ExpenseStatus.DELETED) {
            return;
        }

        Expense deleted = new Expense.Builder()
                .id(existing.getId())
                .description(existing.getDescription())
                .amount(existing.getAmount())
                .category(existing.getCategory())
                .date(existing.getDate())
                .status(ExpenseStatus.DELETED)
                .version(existing.getVersion() + 1)
                .transactionType(existing.getTransactionType())
                .createdAt(LocalDateTime.now())
                .build();

        expenseRepository.save(deleted);
    }

    @Override
    public List<Expense> getExpenseHistory(String id) {
        return expenseRepository.findHistoryById(id);
    }

    @Override
    public void saveAllExpenses(List<Expense> expenses) {
        if (expenses == null || expenses.isEmpty()) {
            return;
        }
        expenseRepository.saveAll(expenses);
    }

    @Override
    public List<Expense> getExpensesByType(TransactionType type) {
        return expenseRepository.findByType(type);
    }

}
