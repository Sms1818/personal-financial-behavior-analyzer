package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;

@Repository
public interface  ExpenseJPARepository extends JpaRepository<Expense, String> {
    List<Expense> findByCategory(Category category);

    List<Expense> findByDateBetween(LocalDate start, LocalDate end);
}
