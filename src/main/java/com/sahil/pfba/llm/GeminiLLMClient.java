package com.sahil.pfba.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sahil.pfba.insights.Insight;

@Component
@Primary
public class GeminiLLMClient implements LLMClient {

    private final WebClient webClient;
    private final String apiKey;

    public GeminiLLMClient(
            WebClient.Builder webClientBuilder,
            @Value("${llm.gemini.api-key}") String apiKey,
            @Value("${llm.gemini.api-url:https://generativelanguage.googleapis.com}") String baseUrl
    ) {
        this.apiKey = apiKey;
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    @Override
    public String generateExplanation(Insight insight) {
        String prompt = buildPrompt(insight);

        String requestBody = """
            {
              "contents": [
                {
                  "parts": [
                    { "text": "%s" }
                  ]
                }
              ]
            }
            """.formatted(prompt.replace("\"", "\\\""));

        String response = webClient.post()
                .uri("/v1beta/models/gemini-2.0-flash:generateContent")
                .header("X-goog-api-key", apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractText(response);
    }

    private String buildPrompt(Insight insight) {
        return """
        You are a personal finance assistant.

        Insight type: %s
        Severity: %s
        Message: %s

        Explain this insight in clear, actionable language for a user.
        """.formatted(
                insight.getType(),
                insight.getSeverity(),
                insight.getMessage()
        );
    }

    private String extractText(String rawResponse) {
        // Simple extraction (good enough for now)
        int idx = rawResponse.indexOf("\"text\"");
        if (idx == -1) return null;

        int start = rawResponse.indexOf(":", idx) + 1;
        int end = rawResponse.indexOf("\"", start + 2);
        return rawResponse.substring(start, end).replace("\"", "").trim();
    }
}
