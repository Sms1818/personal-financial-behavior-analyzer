package com.sahil.pfba.llm;

import java.util.List;
import java.util.Map;

import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

public record GeminiRequest(List<Content> contents) {

    public static GeminiRequest fromSignals(
            InsightType type,
            List<InsightSignal> signals
    ) {

        String signalsJson =
        signals.stream()
                .map(signal -> Map.of(
                        "source", signal.getSource(),
                        "evidence", signal.getEvidence()
                ))
                .toList()
                .toString();


        String prompt = """
You are a personal finance intelligence system.

Return ONLY valid JSON.

Schema:
{
  "summary": "string",
  "drivers": ["string"],
  "impact": "string",
  "recommendations": ["string"],
  "confidence": number between 0 and 1
}

Insight type: %s

Detected signals:
%s
""".formatted(type, signalsJson);

        return new GeminiRequest(
                List.of(
                        new Content(
                                List.of(new Part(prompt))
                        )
                )
        );
    }

    public record Content(List<Part> parts) {}
    public record Part(String text) {}
}
