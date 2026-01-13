package com.sahil.pfba.llm;

import org.springframework.stereotype.Component;

import com.sahil.pfba.insights.Insight;

@Component
public class MockLLMClient implements LLMClient {

    @Override
    public String generateExplanation(Insight insight) {

        return switch (insight.getType()) {

            case TOTAL_SPENDING ->
                "Your overall spending is higher than usual. "
              + "This may impact your long-term savings if it continues.";

            case CATEGORY_SPIKE ->
                "One of your spending categories has increased sharply. "
              + "Consider reviewing discretionary expenses.";

            default ->
                "This insight highlights a notable financial pattern worth reviewing.";
        };
    }
}
