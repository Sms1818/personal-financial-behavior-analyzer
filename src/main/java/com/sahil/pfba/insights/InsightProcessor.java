package com.sahil.pfba.insights;

import static com.sahil.pfba.insights.InsightType.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.summary.ExpenseSummary;
import com.sahil.pfba.insights.summary.ExpenseSummaryBuilder;
import com.sahil.pfba.llm.LLMClient;
import com.sahil.pfba.service.ExpenseService;

@Service
public class InsightProcessor {

    private final ExpenseService expenseService;
    // private final List<InsightRule> rules;
    // private final InsightAggregatorService aggregator;
    private final InsightRepository insightRepository;
    private final LLMClient llmClient;

    public InsightProcessor(
            ExpenseService expenseService,
            LLMClient llmClient,
            InsightRepository insightRepository
    ) {
        this.expenseService = expenseService;
        this.llmClient = llmClient;
        this.insightRepository=insightRepository;
    }

    @Transactional
    public void generate() {

        System.out.println("=== INSIGHT GENERATION STARTED ===");

        List<Expense> expenses = expenseService.getAllExpenses();

        if (expenses.isEmpty()) {
            System.out.println("NO EXPENSES FOUND");
            return;
        }

        // // existing rule-based insights
        // List<InsightSignal> signals = rules.stream()
        //         .filter(r -> r.isApplicable(expenses))
        //         .flatMap(r -> r.detectSignals(expenses).stream())
        //         .toList();

        // if (!signals.isEmpty()) {
        //     //aggregator.processSignals(signals);
        // }

        // ✅ new LLM-driven summary insight
        ExpenseSummary summary =
                ExpenseSummaryBuilder.build(expenses);

        InsightExplanation explanation =
                llmClient.generateInsightFromSummary(summary);

        

        System.out.println("LLM GENERATED INSIGHT:");
        System.out.println(JsonUtil.toJson(explanation));

        System.out.println("=== INSIGHT GENERATION FINISHED ===");

        Insight insight =
            new Insight.Builder()
                    .id(UUID.randomUUID().toString())
                    .type(TOTAL_SPENDING) // temporary
                    .severity(InsightSeverity.LOW)
                    .status(InsightStatus.ACTIVE)
                    .message("AI-generated financial insight")
                    .explanation(JsonUtil.toJson(explanation))
                    .lastEvaluatedAt(LocalDateTime.now())
                    .build();

    insightRepository.save(insight);

    System.out.println("✅ SAVED ONE AI INSIGHT");
    }
}

