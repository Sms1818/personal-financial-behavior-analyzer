package com.sahil.pfba.insights;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sahil.pfba.insights.signal.InsightSignal;
import com.sahil.pfba.llm.LLMClient;

@Service
public class InsightAggregatorService {

    private final InsightRepository repository;
    private final LLMClient llmClient;

    public InsightAggregatorService(
            InsightRepository repository,
            LLMClient llmClient
    ) {
        this.repository = repository;
        this.llmClient = llmClient;
    }

    public void processSignals(List<InsightSignal> signals) {

        System.out.println("Aggregator received signals = " + signals.size());

        Map<InsightType, List<InsightSignal>> grouped =
                signals.stream()
                        .collect(Collectors.groupingBy(
                                InsightSignal::getType
                        ));

        for (Map.Entry<InsightType, List<InsightSignal>> entry
                : grouped.entrySet()) {

            InsightType type = entry.getKey();
            List<InsightSignal> group = entry.getValue();

            System.out.println(
                    "Processing insight type = " + type +
                    " | signals = " + group.size()
            );

            System.out.println("Calling LLM for insight type = " + type);

            InsightExplanation explanation;

            try {
                explanation =
                        llmClient.generateInsightSummary(
                                type,
                                group
                        );
            } catch (Exception e) {
                System.out.println("❌ LLM FAILED COMPLETELY");
                e.printStackTrace();
                throw new RuntimeException(
                        "LLM failed for insight type " + type,
                        e
                );
            }

            Insight insight =
                    new Insight.Builder()
                            .id(UUID.randomUUID().toString())  
                            .type(type)
                            .severity(calculateSeverity(group))
                            .status(InsightStatus.ACTIVE)
                            .message(buildMessage(type))
                            .explanation(JsonUtil.toJson(explanation))
                            .lastEvaluatedAt(LocalDateTime.now())
                            .build();

            repository.save(insight);

            System.out.println("Saved insight: " + type);
        }
    }

    private InsightSeverity calculateSeverity(
            List<InsightSignal> signals
    ) {
        if (signals.size() >= 3) return InsightSeverity.HIGH;
        if (signals.size() == 2) return InsightSeverity.MEDIUM;
        return InsightSeverity.LOW;
    }

    private String buildMessage(InsightType type) {
        return switch (type) {
            case TOTAL_SPENDING ->
                    "Overall spending pattern detected";
            case CATEGORY_SPIKE ->
                    "Spending concentration detected in a category";
            default ->
                    "Financial behavior pattern detected";
        };
    }
}


