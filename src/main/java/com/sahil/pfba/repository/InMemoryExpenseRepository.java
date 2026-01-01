package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import com.sahil.pfba.domain.Expense;

public class InMemoryExpenseRepository implements ExpenseRepository {
    private final Map<String, Expense> store=new ConcurrentHashMap<>();

    @Override
    public Expense save(Expense expense){
        store.put(expense.getId(), expense);
        return expense;
    }
    
    @Override
    public List<Expense> findAll(){
        return List.copyOf(store.values());
    }

    @Override
    public List<Expense> findByCategory(String category){
        return store.values()
        .stream()
        .filter(e->e.getCategory().name().equalsIgnoreCase(category))
        .collect(Collectors.toList());
            
    }

    @Override
    public List<Expense> findByDateRange(LocalDate start, LocalDate end){
        return store.values()
        .stream()
        .filter(e-> !e.getDate().isBefore(start) && !e.getDate().isAfter(end))
        .collect(Collectors.toList());
    }
    

    
}
