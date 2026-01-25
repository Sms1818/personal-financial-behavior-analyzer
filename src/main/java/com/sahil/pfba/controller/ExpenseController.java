package com.sahil.pfba.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;
import com.sahil.pfba.audit.ImportType;
import com.sahil.pfba.bulk.CsvExpenseUploadService;
import com.sahil.pfba.controller.dto.CreateExpenseRequest;
import com.sahil.pfba.controller.dto.UpdateExpenseRequest;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final CsvExpenseUploadService csvExpenseUploadService;
    private final ImportAuditService auditService;

    public ExpenseController(
            ExpenseService expenseService,
            CsvExpenseUploadService csvExpenseUploadService,
            ImportAuditService auditService) {

        this.expenseService = expenseService;
        this.csvExpenseUploadService = csvExpenseUploadService;
        this.auditService = auditService;
    }


    @PostMapping
    public ResponseEntity<Expense> addExpense(
            @Valid @RequestBody CreateExpenseRequest request) {

        Expense expense = new Expense.Builder()
                .description(request.description)
                .amount(request.amount)
                .category(request.category)
                .date(request.date)
                .transactionType(request.transactionType)
                .createdAt(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(expenseService.addExpense(expense));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(
            @PathVariable Category category) {

        return ResponseEntity.ok(expenseService.getExpensesByCategory(category));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {

        return ResponseEntity.ok(
                expenseService.getExpensesByDateRange(start, end));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Expense>> getExpensesByType(
            @PathVariable TransactionType type) {

        return ResponseEntity.ok(expenseService.getExpensesByType(type));
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable String id,
            @Valid @RequestBody UpdateExpenseRequest request) {

        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/import")
    public ResponseEntity<String> importExpenses(
            @RequestParam("file") MultipartFile file) {

        ImportAudit audit = auditService.startAudit(
                file.getOriginalFilename(),
                ImportType.CSV
        );

        csvExpenseUploadService.importAsync(file, audit);

        return ResponseEntity
                .accepted()
                .body("Expenses Imported Sucessfully.");
    }

}
