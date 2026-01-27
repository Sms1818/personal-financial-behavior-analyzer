package com.sahil.pfba.insights.summary;

public class LargeExpense {
    private final double amount;
    private final String category;
    private final String description;

    public LargeExpense(
            double amount,
            String category,
            String description
    ) {
        this.amount = amount;
        this.category = category;
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }
}
