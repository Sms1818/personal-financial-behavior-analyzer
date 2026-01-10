package com.sahil.pfba.insights;

import java.util.List;
import java.util.Optional;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.rules.InsightRule;
import com.sahil.pfba.service.ExpenseService;

@Service
public class InsightGenerationService {
    private final ExpenseService expenseService;
    private final InsightRepository insightRepository;
    private final List<InsightRule> insightRules;

    public InsightGenerationService(
        ExpenseService expenseService,
        InsightRepository insightRepository,
        List<InsightRule> insightRules) {
    this.expenseService = expenseService;
    this.insightRepository = insightRepository;
    this.insightRules = insightRules;
}
    @Async("analysisExecutor")
    public void generateInsightsAsync(){
        System.out.println(
            "Insight generation running on thread: " +
            Thread.currentThread().getName()
        );
        
        List<Expense> expenses=expenseService.getAllExpenses();
        if(expenses.isEmpty()){
            return;
        }

        for(InsightRule rule:insightRules){
            if(!rule.isApplicable(expenses)){
                continue;
            }
            Insight insight=rule.generate(expenses);
            if(insight==null){
                continue;
            }


            Optional<Insight> exists=insightRepository.findByTypeAndMessage(insight.getType(), insight.getMessage());
                    
            
            if(exists.isPresent()){
                Insight existing=exists.get();
                InsightSeverity escalatedSeverity=escalateSeverity(existing.getSeverity());

                Insight escalatedInsight = new Insight.Builder()
                    .id(existing.getId())
                    .type(existing.getType())
                    .severity(escalatedSeverity)
                    .status(existing.getStatus())
                    .message(existing.getMessage())
                    .build();
                
                insightRepository.save(escalatedInsight);
                continue;
            }
            Insight newInsight = new Insight.Builder()
                    .id(insight.getId())
                    .type(insight.getType())
                    .severity(InsightSeverity.LOW)
                    .status(InsightStatus.ACTIVE)
                    .message(insight.getMessage())
                    .build();

            insightRepository.save(newInsight);
        }
        }
    

    private InsightSeverity escalateSeverity(InsightSeverity current) {
        return switch (current) {
            case LOW -> InsightSeverity.MEDIUM;
            case MEDIUM -> InsightSeverity.HIGH;
            case HIGH -> InsightSeverity.HIGH;
        };
    }
    
}
