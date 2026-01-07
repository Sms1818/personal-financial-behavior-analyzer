package com.sahil.pfba.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sahil.pfba.bulk.CsvExpenseUploadService;
import com.sahil.pfba.controller.dto.CreateExpenseRequest;
import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;
    private final CsvExpenseUploadService csvExpenseUploadService;

    public ExpenseController(ExpenseService expenseService, CsvExpenseUploadService csvExpenseUploadService) {
        this.expenseService = expenseService;
        this.csvExpenseUploadService = csvExpenseUploadService;
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody CreateExpenseRequest request){
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

    @GetMapping("/analyze/total")
    public CompletableFuture<ResponseEntity<BigDecimal>> getTotalSpendingAsync(){
        return expenseService.analyzeTotalSpendingAsync()
            .thenApply(total -> ResponseEntity.ok(total));

    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String id, @Valid @RequestBody UpdateExpenseRequest request){
        Expense updatedExpense=expenseService.updateExpense(id, request);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id){
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<Expense>> getExpenseHistory(@PathVariable String id){
        List<Expense> history=expenseService.getExpenseHistory(id);
        return ResponseEntity.ok(history);
    }

    @PostMapping(value="/import")
    public ResponseEntity<String> importExpenses(@RequestParam("file") MultipartFile file){
        csvExpenseUploadService.importAysnc(file);
        return ResponseEntity.accepted().body("CSV import started successfully");
    }

}
