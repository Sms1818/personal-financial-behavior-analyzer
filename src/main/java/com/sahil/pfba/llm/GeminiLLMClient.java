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

    System.out.println("=== GEMINI CALL START ===");
    System.out.println("Insight type = " + type);
    System.out.println("Signals = " + signals.size());

    GeminiRequest request =
            GeminiRequest.fromSignals(type, signals);

    System.out.println("Gemini request payload:");
    System.out.println(request);

    GeminiResponse response;

    try {
        response =
                webClient.post()
                        .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(GeminiResponse.class)
                        .block();

        System.out.println("Gemini raw response object:");
        System.out.println(response);

    } catch (Exception e) {
        System.out.println("❌ GEMINI HTTP CALL FAILED");
        e.printStackTrace();
        throw e;
    }

    if (response == null) {
        System.out.println("❌ RESPONSE IS NULL");
        throw new RuntimeException("Gemini response is null");
    }

    if (response.candidates() == null) {
        System.out.println("❌ candidates IS NULL");
        throw new RuntimeException("Gemini candidates null");
    }

    if (response.candidates().isEmpty()) {
        System.out.println("❌ candidates EMPTY");
        throw new RuntimeException("Gemini returned empty candidates");
    }

    System.out.println("=== GEMINI CALL SUCCESS ===");

    return response.toExplanation();
}

}
