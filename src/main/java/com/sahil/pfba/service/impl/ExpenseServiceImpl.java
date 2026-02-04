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
import com.sahil.pfba.metrics.ApplicationMetrics;
import com.sahil.pfba.repository.ExpenseRepository;
import com.sahil.pfba.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ApplicationMetrics metrics;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, ApplicationMetrics metrics) {
        this.expenseRepository = expenseRepository;
        this.metrics = metrics;
    }

    // =====================================================
    // CREATE
    // =====================================================

    @Override
    @Transactional
    public Expense addExpense(String userId, Expense expense) {

        Expense expenseToSave = new Expense.Builder()
                .id(expense.getId())
                .user(expense.getUser())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .date(expense.getDate())
                .transactionType(expense.getTransactionType())
                .version(1)
                .status(ExpenseStatus.ACTIVE)
                .build();

        Expense saved = expenseRepository.save(expenseToSave);
        metrics.expenseCreated();

        return saved;
    }

    // =====================================================
    // READ
    // =====================================================

    @Override
    public List<Expense> getAllExpenses(String userId) {
        return expenseRepository.findAllByUser(userId);
    }

    @Override
    public List<Expense> getExpensesByCategory(
            String userId,
            Category category) {
        return expenseRepository.findByCategory(userId, category);
    }

    @Override
    public List<Expense> getExpensesByDateRange(
            String userId,
            LocalDate start,
            LocalDate end) {
        return expenseRepository.findByDateRange(userId, start, end);
    }

    @Override
    public List<Expense> getExpensesByType(
            String userId,
            TransactionType type) {
        return expenseRepository.findByType(userId, type);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    @Transactional
    public Expense updateExpense(
            String userId,
            String expenseId,
            UpdateExpenseRequest request) {

        Expense existing = expenseRepository
                .findLatestById(userId, expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (existing.getStatus() == ExpenseStatus.DELETED) {
            throw new InvalidExpenseOperationException(
                    "Cannot update deleted expense");
        }

        Expense updated = new Expense.Builder()
                .id(existing.getId())
                .user(existing.getUser())
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

    // =====================================================
    // DELETE (SOFT DELETE)
    // =====================================================

    @Override
    @Transactional
    public void deleteExpense(
            String userId,
            String expenseId) {

        Expense existing = expenseRepository
                .findLatestById(userId, expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (existing.getStatus() == ExpenseStatus.DELETED) {
            return;
        }

        Expense deleted = new Expense.Builder()
                .id(existing.getId())
                .user(existing.getUser())
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

    // =====================================================
    // HISTORY
    // =====================================================

    @Override
    public List<Expense> getExpenseHistory(
            String userId,
            String expenseId) {
        return expenseRepository.findHistoryById(userId, expenseId);
    }

    // =====================================================
    // BULK
    // =====================================================

    

}
