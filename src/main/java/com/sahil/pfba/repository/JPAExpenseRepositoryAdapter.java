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
public class JPAExpenseRepositoryAdapter implements ExpenseRepository{
    private final ExpenseJPARepository expenseJPARepository;

    public JPAExpenseRepositoryAdapter(ExpenseJPARepository expenseJPARepository){
        this.expenseJPARepository=expenseJPARepository;
    }

    @Override
    public Expense save(Expense expense){
        return expenseJPARepository.save(expense);
    }

    @Override
    public Optional<Expense> findLatestById(String id){
        return expenseJPARepository.findLatestById(id);
    }

    @Override
    public List<Expense> findAll() {
        return expenseJPARepository.findAll();
    }

    @Override
    public List<Expense> findByCategory(Category category) {
        return expenseJPARepository.findLatestByCategory(category);
    }

    @Override
    public List<Expense> findByDateRange(LocalDate start, LocalDate end) {
        return expenseJPARepository.findByDateRange(start, end);
    }

    @Override
    public void saveAll(List<Expense> expenses) {
        expenseJPARepository.saveAll(expenses);
    }

    @Override
    public List<Expense> findHistoryById(String id) {
        return expenseJPARepository.findHistoryById(id);
    }

    @Override
    public List<Expense> findByType(TransactionType type) {
        return expenseJPARepository.findByType(type);
    }

}
