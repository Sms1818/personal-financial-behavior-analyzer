package com.sahil.pfba.rules;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightSeverity;
import com.sahil.pfba.insights.InsightType;

@Component
public class TotalSpendingInsightRule implements InsightRule{
    @Override
    public boolean isApplicable(List<Expense> expenses){
        return expenses!=null && !expenses.isEmpty();
    }

    @Override
    public Insight generate(List<Expense> expenses){
        BigDecimal totalSpending= expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new Insight.Builder()
                .id(UUID.randomUUID().toString())
                .type(InsightType.TOTAL_SPENDING)
                .severity(InsightSeverity.LOW)
                .message("Total spending accross all the expenses is "+totalSpending)
                .build();
    }
}
