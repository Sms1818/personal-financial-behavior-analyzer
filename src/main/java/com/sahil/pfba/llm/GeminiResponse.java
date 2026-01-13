package com.sahil.pfba.llm;

import java.util.List;

public record GeminiResponse(List<Candidate> candidates) {

    public String getText() {
        return candidates.get(0)
            .content()
            .parts()
            .get(0)
            .text();
    }

    public record Candidate(Content content) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}
}
