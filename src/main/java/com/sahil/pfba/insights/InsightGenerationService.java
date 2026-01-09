package com.sahil.pfba.insights;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.service.ExpenseService;

@Service
public class InsightGenerationService {
    private final ExpenseService expenseService;
    private final InsightRepository insightRepository;

    public InsightGenerationService(ExpenseService expenseService, InsightRepository insightRepository) {
        this.expenseService = expenseService;
        this.insightRepository = insightRepository;
    }

    public void generateTotalSpendingInsight(){
        List<Expense> expenses = expenseService.getAllExpenses();
        if(expenses.isEmpty()){
            return;
        }
        BigDecimal totalSpending=expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Insight insight=new Insight.Builder()
            .id(UUID.randomUUID().toString())
            .type(InsightType.TOTAL_SPENDING)
            .severity(InsightSeverity.LOW)
            .message("Total spending across all expenses is " + totalSpending)
            .build();
        
        insightRepository.save(insight);
            
     }
    
}
