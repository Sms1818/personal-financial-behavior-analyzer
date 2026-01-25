package com.sahil.pfba.rules;

import java.util.List;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

public interface InsightRule {

    InsightType getType();

    boolean isApplicable(List<Expense> expenses);

    List<InsightSignal> detectSignals(List<Expense> expenses);
}

