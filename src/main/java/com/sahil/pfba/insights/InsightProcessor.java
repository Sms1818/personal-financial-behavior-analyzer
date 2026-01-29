package com.sahil.pfba.insights;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.summary.ExpenseSummary;
import com.sahil.pfba.insights.summary.ExpenseSummaryBuilder;
import com.sahil.pfba.llm.LLMClient;
import com.sahil.pfba.llm.MultiInsightResponse;
import com.sahil.pfba.service.ExpenseService;

@Service
public class InsightProcessor {

    private final ExpenseService expenseService;
    private final InsightRepository insightRepository;
    private final LLMClient llmClient;

    public InsightProcessor(
            ExpenseService expenseService,
            LLMClient llmClient,
            InsightRepository insightRepository
    ) {
        this.expenseService = expenseService;
        this.llmClient = llmClient;
        this.insightRepository = insightRepository;
    }

    @Transactional
    public void generate() {

        System.out.println("=== INSIGHT GENERATION STARTED ===");

        List<Expense> expenses = expenseService.getAllExpenses();

        if (expenses.isEmpty()) {
            System.out.println("NO EXPENSES FOUND");
            return;
        }

        // ✅ Build expense summary
        ExpenseSummary summary =
                ExpenseSummaryBuilder.build(expenses);

        // ✅ Call LLM (multi-insight)
        MultiInsightResponse response =
                llmClient.generateInsightFromSummary(summary);

        if (response == null
                || response.getInsights() == null
                || response.getInsights().isEmpty()) {

            System.out.println("❌ NO INSIGHTS RETURNED FROM LLM");
            return;
        }

        System.out.println(
                "LLM GENERATED " + response.getInsights().size() + " INSIGHTS"
        );

        // ✅ Save each insight independently
        for (InsightExplanation explanation : response.getInsights()) {

            Insight insight =
                    new Insight.Builder()
                            .id(UUID.randomUUID().toString())
                            .type(InsightType.GENERAL)
                            .severity(
                                explanation.getSeverity() != null
                                    ? explanation.getSeverity()
                                    : InsightSeverity.MEDIUM
                            )
                            .status(InsightStatus.ACTIVE)
                            .message(explanation.getSummary())
                            .explanation(JsonUtil.toJson(explanation))
                            .lastEvaluatedAt(LocalDateTime.now())
                            .build();

            insightRepository.save(insight);

            System.out.println("✅ SAVED AI INSIGHT → " + explanation.getSummary());
        }

        System.out.println("=== INSIGHT GENERATION FINISHED ===");
    }
}
