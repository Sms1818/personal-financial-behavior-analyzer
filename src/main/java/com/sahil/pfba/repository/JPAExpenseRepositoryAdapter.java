package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;

@Repository
@Profile("prod")
public class JPAExpenseRepositoryAdapter implements ExpenseRepository {

    private final ExpenseJPARepository expenseJPARepository;

    public JPAExpenseRepositoryAdapter(
            ExpenseJPARepository expenseJPARepository
    ) {
        this.expenseJPARepository = expenseJPARepository;
    }

    // ============================
    // WRITE
    // ============================

    @Override
    public Expense save(Expense expense) {
        return expenseJPARepository.save(expense);
    }

    @Override
    public void saveAll(String userId,List<Expense> expenses) {
        expenseJPARepository.saveAll(expenses);
    }


    @Override
    public List<Expense> findAllByUser(String userId) {
        return expenseJPARepository.findAllByUser(userId);
    }

    @Override
    public Optional<Expense> findLatestById(
            String userId,
            String expenseId
    ) {
        return expenseJPARepository.findLatestById(userId, expenseId);
    }

    @Override
    public List<Expense> findHistoryById(
            String userId,
            String expenseId
    ) {
        return expenseJPARepository.findHistoryById(userId, expenseId);
    }

    @Override
    public List<Expense> findByCategory(
            String userId,
            Category category
    ) {
        return expenseJPARepository
                .findLatestByCategory(userId, category);
    }

    @Override
    public List<Expense> findByDateRange(
            String userId,
            LocalDate start,
            LocalDate end
    ) {
        return expenseJPARepository
                .findByDateRange(userId, start, end);
    }

    @Override
    public List<Expense> findByType(
            String userId,
            TransactionType type
    ) {
        return expenseJPARepository
                .findByType(userId, type);
    }
}
