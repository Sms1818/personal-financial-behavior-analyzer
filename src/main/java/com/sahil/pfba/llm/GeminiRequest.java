package com.sahil.pfba.llm;

import java.util.List;

import com.sahil.pfba.insights.Insight;

public record GeminiRequest(List<Content> contents) {

    public static GeminiRequest fromInsight(Insight insight) {
        return new GeminiRequest(
            List.of(
                new Content(
                    List.of(
                        new Part(buildPrompt(insight))
                    )
                )
            )
        );
    }

    private static String buildPrompt(Insight insight) {
        return """
        You are a financial assistant.

        Insight:
        Type: %s
        Severity: %s
        Message: %s

        Explain this insight in simple, actionable terms.
        """.formatted(
            insight.getType(),
            insight.getSeverity(),
            insight.getMessage()
        );
    }

    public record Content(List<Part> parts) {}
    public record Part(String text) {}
}
