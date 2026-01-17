package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;

@Repository
@Profile("dev")
public class InMemoryExpenseRepository implements ExpenseRepository {
    private final Map<String, List<Expense>> store=new ConcurrentHashMap<>();

    @Override
    public Expense save(Expense expense){
        store.computeIfAbsent(expense.getId(), k->new ArrayList<>()).add(expense);
        return expense;
    }

    @Override
    public Optional<Expense> findById(String id){
        List<Expense> versions=store.get(id);
        if(versions==null || versions.isEmpty()){
            return Optional.empty();
        }
        return Optional.of(versions.get(versions.size()-1));
    }

    @Override
    public List<Expense> findHistoryById(String id){
        return store.getOrDefault(id, List.of());
    }
    
    @Override
    public List<Expense> findAll(){
        return store.values()
               .stream()
               .map(list->list.get(list.size()-1))
               .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
               .collect(Collectors.toList());
    }

    @Override
    public List<Expense> findByCategory(Category category){
        return store.values()
        .stream()
        .map(list->list.get(list.size()-1))
        .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
        .filter(e->e.getCategory()==category)
        .collect(Collectors.toList());
            
    }

    @Override
    public List<Expense> findByDateRange(LocalDate start, LocalDate end){
        return store.values()
        .stream()
        .map(list->list.get(list.size()-1))
        .filter(e->e.getStatus()!=null && e.getStatus()==ExpenseStatus.ACTIVE)
        .filter(e-> !e.getDate().isBefore(start) && !e.getDate().isAfter(end))
        .collect(Collectors.toList());
    }
    @Override
    public void saveAll(List<Expense> expenses) {
        for (Expense expense : expenses) {
            save(expense);
        }
    }

}
