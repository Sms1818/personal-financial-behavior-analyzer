package com.sahil.pfba.llm;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahil.pfba.insights.InsightExplanation;

public record GeminiResponse(List<Candidate> candidates) {

    private static final ObjectMapper mapper = new ObjectMapper();

    public InsightExplanation toExplanation() {

        try {
            System.out.println("=== PARSING GEMINI RESPONSE ===");
    
            String raw =
                    candidates.get(0)
                            .content()
                            .parts()
                            .get(0)
                            .text();
    
            System.out.println("RAW GEMINI TEXT:");
            System.out.println(raw);
    
            String json = extractJson(raw);
    
            System.out.println("EXTRACTED JSON:");
            System.out.println(json);
    
            InsightExplanation explanation =
                    mapper.readValue(json, InsightExplanation.class);
    
            System.out.println("PARSED EXPLANATION OBJECT:");
            System.out.println(mapper.writeValueAsString(explanation));
    
            return explanation;
    
        } catch (Exception e) {
    
            System.out.println("❌ FAILED TO PARSE GEMINI RESPONSE");
            e.printStackTrace();
    
            return InsightExplanation.fallback();
        }
    }
    

    private String extractJson(String text) {

        text = text
                .replace("```json", "")
                .replace("```", "")
                .trim();

        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("Invalid Gemini JSON");
        }

        return text.substring(start, end + 1);
    }

    public record Candidate(Content content) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}
}
