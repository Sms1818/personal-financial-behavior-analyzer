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
        @Value("${llm.gemini.api-key}") String apiKey
    ) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    @Override
    public String generateExplanation(Insight insight) {
        GeminiRequest request = GeminiRequest.fromInsight(insight);

        GeminiResponse response = webClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/models/gemini-pro:generateContent")
                .queryParam("key", apiKey)
                .build()
            )
            .bodyValue(request)
            .retrieve()
            .bodyToMono(GeminiResponse.class)
            .block();

        return response.getText();
    }
}