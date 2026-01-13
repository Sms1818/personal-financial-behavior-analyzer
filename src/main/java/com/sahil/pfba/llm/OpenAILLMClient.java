package com.sahil.pfba.llm;

import java.util.List;
import java.util.concurrent.Semaphore;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sahil.pfba.insights.Insight;

@Component
@Profile("openai")
public class OpenAILLMClient implements LLMClient {

    // Max 2 concurrent OpenAI calls
    private static final Semaphore RATE_LIMITER = new Semaphore(2);

    private final WebClient webClient;
    private final String model;

    public OpenAILLMClient(
            @Value("${llm.openai.api-key}") String apiKey,
            @Value("${llm.openai.model}") String model
    ) {
        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public String generateExplanation(Insight insight) {
        boolean acquired = false;

        try {
            // 🔐 Rate limit concurrent calls
            RATE_LIMITER.acquire();
            acquired = true;

            return callOpenAI(insight);

        } catch (WebClientResponseException.TooManyRequests e) {
            // 🔁 Single retry with backoff
            try {
                Thread.sleep(3000); // 3s backoff
                return callOpenAI(insight);
            } catch (Exception retryException) {
                return null;
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;

        } catch (Exception e) {
            return null;

        } finally {
            if (acquired) {
                RATE_LIMITER.release();
            }
        }
    }

    private String callOpenAI(Insight insight) {
        OpenAIRequest request = new OpenAIRequest(
                model,
                List.of(new OpenAIRequest.Message("user", buildPrompt(insight)))
        );

        OpenAIResponse response = webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .block();

        if (response == null || response.choices().isEmpty()) {
            return null;
        }

        return response.choices().get(0).message().content();
    }

    private String buildPrompt(Insight insight) {
        return """
            You are a financial assistant.

            Given the following insight:
            Type: %s
            Severity: %s
            Message: %s

            Explain this insight in simple, actionable terms for a user.
            """.formatted(
                insight.getType(),
                insight.getSeverity(),
                insight.getMessage()
        );
    }
}
