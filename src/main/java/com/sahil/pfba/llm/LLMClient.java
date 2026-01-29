package com.sahil.pfba.llm;

import com.sahil.pfba.insights.summary.ExpenseSummary;

public interface LLMClient {

    // InsightExplanation generateInsightSummary(
    //         InsightType type,
    //         List<InsightSignal> signals
    // );

    // InsightExplanation generateInsightFromSummary(
    //     Object expenseSummary
    // );

    MultiInsightResponse generateInsightFromSummary(ExpenseSummary summary);
}
