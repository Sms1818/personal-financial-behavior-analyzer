package com.sahil.pfba.llm;

import java.util.List;

import com.sahil.pfba.insights.InsightExplanation;
import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

public interface LLMClient {

    InsightExplanation generateInsightSummary(
            InsightType type,
            List<InsightSignal> signals
    );

    InsightExplanation generateInsightFromSummary(
        Object expenseSummary
    );
}
