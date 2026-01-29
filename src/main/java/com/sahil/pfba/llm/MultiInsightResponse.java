package com.sahil.pfba.llm;

import java.util.List;

import com.sahil.pfba.insights.InsightExplanation;

public class MultiInsightResponse {

    private List<InsightExplanation> insights;

    public List<InsightExplanation> getInsights() {
        return insights;
    }

    public void setInsights(List<InsightExplanation> insights) {
        this.insights = insights;
    }
}
