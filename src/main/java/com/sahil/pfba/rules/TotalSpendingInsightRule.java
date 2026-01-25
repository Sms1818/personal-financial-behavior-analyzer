package com.sahil.pfba.rules;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

@Component
public class TotalSpendingInsightRule implements InsightRule {

    @Override
    public InsightType getType() {
        return InsightType.TOTAL_SPENDING;
    }

    @Override
    public boolean isApplicable(List<Expense> expenses) {
        return expenses != null && !expenses.isEmpty();
    }

    @Override
    public List<InsightSignal> detectSignals(
            List<Expense> expenses
    ) {

        // ✅ only real spending
        List<Expense> debits =
                expenses.stream()
                        .filter(e ->
                                e.getTransactionType()
                                        == TransactionType.DEBIT
                        )
                        .toList();

        if (debits.isEmpty()) return List.of();

        BigDecimal totalSpending =
                debits.stream()
                        .map(Expense::getAmount)
                        .map(BigDecimal::abs)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        return List.of(
                new InsightSignal(
                        InsightType.TOTAL_SPENDING,
                        "TOTAL",
                        Map.of(
                                "totalSpending", totalSpending,
                                "transactionCount", debits.size()
                        )
                )
        );
    }
}
