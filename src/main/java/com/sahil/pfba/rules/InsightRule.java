package com.sahil.pfba.rules;

import java.util.List;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.Insight;

public interface InsightRule {
    boolean isApplicable(List<Expense> expenses);
    Insight generate(List<Expense> expenses);
}
