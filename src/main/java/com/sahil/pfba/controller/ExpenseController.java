package com.sahil.pfba.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.controller.dto.CreateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody CreateExpenseRequest request){
        Expense expense=new Expense.Builder()
            .id(request.id)
            .description(request.description)
            .amount(request.amount)
            .category(request.category)
            .date(request.date)
            .build();

        Expense savedExpense=expenseService.addExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
        
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(){
        List<Expense> expenses=expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable Category category){
        List<Expense> expenses=expenseService.getExpensesByCategory(category);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(@RequestParam LocalDate start, @RequestParam LocalDate end){
        List<Expense> expenses=expenseService.getExpensesByDateRange(start, end);
        return ResponseEntity.ok(expenses);
    }
}
