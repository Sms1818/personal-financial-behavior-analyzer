package com.sahil.pfba.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.domain.User;
import com.sahil.pfba.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
@PreAuthorize("hasRole('USER')")
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

    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<Expense> addExpense(
            @Valid @RequestBody CreateExpenseRequest request,
            Authentication authentication) {

        String userId = authentication.getPrincipal().toString();

        Expense expense = new Expense.Builder()
                .id(UUID.randomUUID().toString())
                .user(new User(userId))
                .description(request.description)
                .amount(request.amount)
                .category(request.category)
                .date(request.date)
                .transactionType(request.transactionType)
                .version(1)
                .status(ExpenseStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        expense = expenseService.addExpense(userId, expense);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(expense);
    }

    // =====================================================
    // READ
    // =====================================================

    @GetMapping
    public List<Expense> getAllExpenses(
            Authentication authentication) {

        String userId = authentication.getPrincipal().toString();
        return expenseService.getAllExpenses(userId);
    }

    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory(
            Authentication authentication,
            @PathVariable Category category) {

        String userId = authentication.getPrincipal().toString();
        return expenseService.getExpensesByCategory(userId, category);
    }

    @GetMapping("/range")
    public List<Expense> getExpensesByDateRange(
            Authentication authentication,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {

        String userId = authentication.getPrincipal().toString();
        return expenseService.getExpensesByDateRange(userId, start, end);
    }

    @GetMapping("/type/{type}")
    public List<Expense> getExpensesByType(
            Authentication authentication,
            @PathVariable TransactionType type) {

        String userId = authentication.getPrincipal().toString();
        return expenseService.getExpensesByType(userId, type);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public Expense updateExpense(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody UpdateExpenseRequest request) {

        String userId = authentication.getPrincipal().toString();
        return expenseService.updateExpense(userId, id, request);
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            Authentication authentication,
            @PathVariable String id) {

        String userId = authentication.getPrincipal().toString();
        expenseService.deleteExpense(userId, id);
        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // IMPORT
    // =====================================================

    @PostMapping("/import")
    public ResponseEntity<String> importExpenses(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {

        String userId = authentication.getPrincipal().toString();

        ImportAudit audit = auditService.startAudit(
                file.getOriginalFilename(),
                ImportType.CSV);

        byte[] bytes = file.getBytes();

        csvExpenseUploadService.importAsync(bytes, audit, userId);

        return ResponseEntity
                .accepted()
                .body("Expenses import started");
    }

}
