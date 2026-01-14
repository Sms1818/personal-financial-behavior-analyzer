package com.sahil.pfba.rules;

import java.util.List;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightSeverity;
import com.sahil.pfba.insights.InsightType;

public interface InsightRule {
    InsightType getType();
    boolean isApplicable(List<Expense> expenses);
    Insight generate(List<Expense> expenses);
    InsightSeverity initialSeverity();
}
