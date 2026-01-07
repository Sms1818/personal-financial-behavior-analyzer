package com.sahil.pfba.bulk;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.service.ExpenseService;

@Service
public class CsvExpenseUploadService {
    private final ExpenseService expenseService;

    public CsvExpenseUploadService(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @Async("analysisExecutor")
    public CompletableFuture<BulkUploadResult> importAysnc(MultipartFile file){
        System.out.println(
            "CSV import running on thread: " + Thread.currentThread().getName()
        );
        BulkUploadResult result = parse(file);
        expenseService.saveAllExpenses(result.getValidExpenses());
        return CompletableFuture.completedFuture(result);
    }

    public BulkUploadResult parse(MultipartFile file){
        List<Expense> validExpenses=new ArrayList<>();
        List<BulkUploadError> errors = new ArrayList<>();

        try (BufferedReader reader=new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int rowNumber=0;
            while((line=reader.readLine())!=null){
                rowNumber++;
                if(rowNumber==1) continue;

                try {
                    Expense expense=parseLine(line);
                    validExpenses.add(expense);
                    
                } catch (Exception e) {
                    errors.add(new BulkUploadError(rowNumber,e.getMessage()));
                }
            }
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file");
            
        }
        return new BulkUploadResult(validExpenses,errors);
    
    }
    private Expense parseLine(String line) {

        String[] tokens = line.split(",");

        if (tokens.length != 5) {
            throw new IllegalArgumentException("Invalid column count");
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(tokens[2].trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid amount format");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        return new Expense.Builder()
                .id(tokens[0].trim())
                .description(tokens[1].trim())
                .amount(amount)
                .category(Category.valueOf(tokens[3].trim()))
                .date(LocalDate.parse(tokens[4].trim()))
                .status(ExpenseStatus.ACTIVE)
                .build();
    }
}

    

