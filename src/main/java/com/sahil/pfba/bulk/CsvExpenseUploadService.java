package com.sahil.pfba.bulk;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.audit.ImportAuditService;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.service.ExpenseService;

@Service
public class CsvExpenseUploadService {
    private final ExpenseService expenseService;
    private final ImportAuditService auditService;
    private final ExpenseImportProcessor importProcessor;

    public CsvExpenseUploadService(ExpenseService expenseService, ImportAuditService auditService, ExpenseImportProcessor importProcessor) {
        this.expenseService = expenseService;
        this.auditService = auditService;
        this.importProcessor=importProcessor;
    }

    @Async("analysisExecutor")
    public void importAsync(MultipartFile file, ImportAudit audit){
        BulkUploadResult result = parse(file);
        importProcessor.process(result, audit);
    }

    

    public BulkUploadResult parse(MultipartFile file){
        List<Expense> validExpenses=new ArrayList<>();
        List<BulkUploadError> errors = new ArrayList<>();

        int rowNumber=0;

        try (BufferedReader reader=new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            
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
        return new BulkUploadResult(rowNumber-1,validExpenses,errors);
    
    }
    private Expense parseLine(String line) {

        String[] tokens = line.split(",");

        if (tokens.length != 6) {
            throw new IllegalArgumentException("Invalid column count");
        }

        TransactionType transactionType=TransactionType.valueOf(tokens[5].trim());


        BigDecimal amount;
        try {
            amount = new BigDecimal(tokens[2].trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid amount format");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if(transactionType==TransactionType.DEBIT){
            amount=amount.negate();
        }

        return new Expense.Builder()
                .id(tokens[0].trim())
                .description(tokens[1].trim())
                .amount(amount)
                .category(Category.valueOf(tokens[3].trim()))
                .date(LocalDate.parse(tokens[4].trim()))
                .transactionType(transactionType)
                .status(ExpenseStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
    }
}

    

