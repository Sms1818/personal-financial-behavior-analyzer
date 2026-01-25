package com.sahil.pfba.llm;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahil.pfba.insights.InsightExplanation;

public record GeminiResponse(List<Candidate> candidates) {

    private static final ObjectMapper mapper = new ObjectMapper();

    public InsightExplanation toExplanation() {

        try {
            String raw =
                    candidates.get(0)
                            .content()
                            .parts()
                            .get(0)
                            .text();

            String json = extractJson(raw);

            return mapper.readValue(
                    json,
                    InsightExplanation.class
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid Gemini JSON response",
                    e
            );
        }
    }

    /**
     * Gemini often returns:
     *
     * ```json
     * { ... }
     * ```
     *
     * or text before JSON.
     *
     * This safely extracts only the JSON object.
     */
    private String extractJson(String text) {

        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException(
                    "No valid JSON found in Gemini response:\n" + text
            );
        }

        return text.substring(start, end + 1);
    }

    public record Candidate(Content content) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}
}
