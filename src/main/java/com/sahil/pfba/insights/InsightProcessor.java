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
    public void generate(String userId) {

        List<Expense> expenses =
                expenseService.getAllExpenses(userId);

        if (expenses.isEmpty()) {
            return;
        }

        ExpenseSummary summary =
                ExpenseSummaryBuilder.build(expenses);

        MultiInsightResponse response =
                llmClient.generateInsightFromSummary(summary);

        if (response == null || response.getInsights() == null) {
            return;
        }

        for (InsightExplanation explanation : response.getInsights()) {

            Insight insight =
                    new Insight.Builder()
                            .id(UUID.randomUUID().toString())
                            .userId(userId)
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
        }
    }
}
