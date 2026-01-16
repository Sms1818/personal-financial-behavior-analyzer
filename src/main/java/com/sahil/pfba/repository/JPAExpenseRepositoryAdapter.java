package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;

@Repository
@Primary
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
    public Optional<Expense> findById(String id){
        return expenseJPARepository.findById(id);
    }

    @Override
    public List<Expense> findAll() {
        return expenseJPARepository.findAll();
    }

    @Override
    public List<Expense> findByCategory(Category category) {
        return expenseJPARepository.findByCategory(category);
    }

    @Override
    public List<Expense> findByDateRange(LocalDate start, LocalDate end) {
        return expenseJPARepository.findByDateBetween(start, end);
    }

    @Override
    public void saveAll(List<Expense> expenses) {
        expenseJPARepository.saveAll(expenses);
    }

    @Override
    public List<Expense> findHistoryById(String id) {
        // versioning handled later (Flyway / history table)
        return List.of();
    }


    
}
