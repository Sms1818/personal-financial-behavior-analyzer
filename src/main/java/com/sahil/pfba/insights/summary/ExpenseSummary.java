package com.sahil.pfba.insights.summary;

import java.util.List;
import java.util.Map;

public class ExpenseSummary {
    private final double totalAmount;
    private final double averageExpense;
    private final int transactionCount;

    private final Map<String, Double> categoryTotals;
    private final Map<String, Long> categoryCounts;

    private final List<LargeExpense> largestExpenses;

    public ExpenseSummary(
            double totalAmount,
            double averageExpense,
            int transactionCount,
            Map<String, Double> categoryTotals,
            Map<String, Long> categoryCounts,
            List<LargeExpense> largestExpenses
    ) {
        this.totalAmount = totalAmount;
        this.averageExpense = averageExpense;
        this.transactionCount = transactionCount;
        this.categoryTotals = categoryTotals;
        this.categoryCounts = categoryCounts;
        this.largestExpenses = largestExpenses;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public double getAverageExpense() {
        return averageExpense;
    }

    public int getTransactionCount() {
        return transactionCount;
    }

    public Map<String, Double> getCategoryTotals() {
        return categoryTotals;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public List<LargeExpense> getLargestExpenses() {
        return largestExpenses;
    }
}
