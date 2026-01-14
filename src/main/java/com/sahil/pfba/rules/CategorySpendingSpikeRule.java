package com.sahil.pfba.rules;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightSeverity;
import com.sahil.pfba.insights.InsightType;

@Component
public class CategorySpendingSpikeRule implements InsightRule {
    private final static BigDecimal SPIKE_THRESHOLD= new BigDecimal("0.40");

    @Override
    public InsightType getType() {
        return InsightType.CATEGORY_SPIKE;
    }

    @Override
    public boolean isApplicable(List<Expense> expenses) {
       return expenses!=null && expenses.size()>=3;
    }

    @Override
    public Insight generate(List<Expense> expenses){
        BigDecimal totalSpending= expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);
        
        Map<Category, BigDecimal> categoryTotals= expenses.stream()
                .collect(Collectors.groupingBy(
                    Expense::getCategory,
                    Collectors.mapping(
                        Expense::getAmount,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                    )
                ));
        
        Map.Entry<Category,BigDecimal> maxEntry=categoryTotals.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .orElseThrow();
        
        BigDecimal ratio=maxEntry.getValue()
                .divide(totalSpending,2,RoundingMode.HALF_UP);
        
        if(ratio.compareTo(SPIKE_THRESHOLD)<0){
            return null;
        }

        String message= String.format("High spending detected in category %s (%.0f%% of total spending)",
        maxEntry.getKey(),
        ratio.multiply(BigDecimal.valueOf(100))
        );

        return new Insight.Builder()
            .id(UUID.randomUUID().toString())
            .type(InsightType.CATEGORY_SPIKE)
            .severity(InsightSeverity.MEDIUM)
            .message(message)
            .build();
        
    }

    @Override
    public InsightSeverity initialSeverity() {
        return InsightSeverity.LOW;
    }

    
}
