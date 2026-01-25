package com.sahil.pfba.llm;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sahil.pfba.insights.InsightExplanation;
import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

@Component
@Primary
@Profile("prod")
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
    public InsightExplanation generateInsightSummary(
            InsightType type,
            List<InsightSignal> signals
    ) {

        GeminiRequest request =
                GeminiRequest.fromSignals(type, signals);

        GeminiResponse response =
                webClient.post()
                        .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(GeminiResponse.class)
                        .block();

        if (response == null) {
            throw new RuntimeException("Empty Gemini response");
        }

        return response.toExplanation();
    }
}
