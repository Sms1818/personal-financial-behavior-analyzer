package com.sahil.pfba.bulk;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sahil.pfba.audit.ImportAudit;
import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.domain.User;

@Service
public class CsvExpenseUploadService {

    private final ExpenseImportProcessor importProcessor;

    public CsvExpenseUploadService(
            ExpenseImportProcessor importProcessor) {
        this.importProcessor = importProcessor;
    }

    // =====================================================
    // ASYNC ENTRY POINT (FIXED)
    // =====================================================

    @Async("analysisExecutor")
    @Transactional
    public void importAsync(
            MultipartFile file,
            ImportAudit audit,
            String userId) {

        try {
            // ✅ VERY IMPORTANT FIX
            byte[] bytes = file.getBytes();

            BulkUploadResult result =
                    parse(bytes, userId);

            importProcessor.process(
                    result,
                    audit,
                    userId
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to import CSV", e);
        }
    }

    // =====================================================
    // CSV PARSER
    // =====================================================

    private BulkUploadResult parse(
            byte[] bytes,
            String userId) {

        List<Expense> validExpenses = new ArrayList<>();
        List<BulkUploadError> errors = new ArrayList<>();

        int rowNumber = 0;

        try (BufferedReader reader =
                     new BufferedReader(
                         new InputStreamReader(
                             new ByteArrayInputStream(bytes)))) {

            String line;

            while ((line = reader.readLine()) != null) {
                rowNumber++;

                // skip header
                if (rowNumber == 1) continue;

                try {
                    Expense expense =
                            parseLine(line, userId);

                    validExpenses.add(expense);

                } catch (Exception e) {
                    errors.add(
                        new BulkUploadError(
                            rowNumber,
                            e.getMessage()));
                }
            }

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to read CSV file", e);
        }

        return new BulkUploadResult(
                rowNumber - 1,
                validExpenses,
                errors);
    }

    // =====================================================
    // LINE PARSER
    // =====================================================

    private Expense parseLine(
            String line,
            String userId) {

        String[] tokens = line.split(",");

        if (tokens.length != 6) {
            throw new IllegalArgumentException(
                    "Invalid column count");
        }

        String id = tokens[0].trim();
        String description = tokens[1].trim();
        var amount =
                new java.math.BigDecimal(tokens[2].trim());

        Category category =
                Category.valueOf(tokens[3].trim());

        LocalDate date =
                LocalDate.parse(tokens[4].trim());

        TransactionType type =
                TransactionType.valueOf(tokens[5].trim());

        if (type == TransactionType.DEBIT) {
            amount = amount.negate();
        }

        return new Expense.Builder()
                .id(id)
                .user(new User(userId))
                .description(description)
                .amount(amount)
                .category(category)
                .date(date)
                .transactionType(type)
                .version(1)
                .status(ExpenseStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
