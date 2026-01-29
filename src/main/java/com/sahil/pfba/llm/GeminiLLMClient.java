package com.sahil.pfba.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sahil.pfba.insights.summary.ExpenseSummary;

@Component
@Primary
@Profile("prod")
public class GeminiLLMClient implements LLMClient {

    private final WebClient webClient;
    private final String apiKey;

    public GeminiLLMClient(
            WebClient.Builder webClientBuilder,
            @Value("${llm.gemini.api-key}") String apiKey,
            @Value("${llm.gemini.api-url:https://generativelanguage.googleapis.com}") String baseUrl) {
        this.apiKey = apiKey;
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    @Override
    public MultiInsightResponse generateInsightFromSummary(
            ExpenseSummary summary
    ) {
    
        System.out.println("=== GEMINI MULTI-INSIGHT CALL START ===");
    
        GeminiRequest request =
                GeminiRequest.fromExpenseSummary(summary);
    
        GeminiResponse response = webClient.post()
                .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();
    
        if (response == null) {
            return new MultiInsightResponse();
        }
    
        return response.toMultiInsightResponse();
    }
    

}
