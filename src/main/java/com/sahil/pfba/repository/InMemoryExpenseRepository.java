package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;

@Repository
public class InMemoryExpenseRepository implements ExpenseRepository {
    private final Map<String, Expense> store=new ConcurrentHashMap<>();

    @Override
    public Expense save(Expense expense){
        store.put(expense.getId(), expense);
        return expense;
    }

    @Override
    public Optional<Expense> findById(String id){
        Expense expense=store.get(id);
        return Optional.ofNullable(expense);
    }
    
    @Override
    public List<Expense> findAll(){
        return store.values()
               .stream() 
               .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
               .collect(Collectors.toList());
    }

    @Override
    public List<Expense> findByCategory(Category category){
        return store.values()
        .stream()
        .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
        .filter(e->e.getCategory()==category)
        .collect(Collectors.toList());
            
    }

    @Override
    public List<Expense> findByDateRange(LocalDate start, LocalDate end){
        return store.values()
        .stream()
        .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
        .filter(e-> !e.getDate().isBefore(start) && !e.getDate().isAfter(end))
        .collect(Collectors.toList());
    }

}
