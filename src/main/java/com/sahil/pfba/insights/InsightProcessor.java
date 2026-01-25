package com.sahil.pfba.insights;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.insights.signal.InsightSignal;
import com.sahil.pfba.rules.InsightRule;
import com.sahil.pfba.service.ExpenseService;

@Service
public class InsightProcessor {

    private final ExpenseService expenseService;
    private final List<InsightRule> rules;
    private final InsightAggregatorService aggregator;

    public InsightProcessor(
            ExpenseService expenseService,
            List<InsightRule> rules,
            InsightAggregatorService aggregator) {
        this.expenseService = expenseService;
        this.rules = rules;
        this.aggregator = aggregator;
    }

    @Transactional
    public void generate() {

        System.out.println("=== INSIGHT GENERATION STARTED ===");

        List<Expense> expenses = expenseService.getAllExpenses();

        System.out.println("Expenses count = " + expenses.size());

        if (expenses.isEmpty()) {
            System.out.println("NO EXPENSES FOUND");
            return;
        }

        System.out.println("Rules loaded = " + rules.size());

        List<InsightSignal> signals = rules.stream()
                .filter(r -> {
                    boolean applicable = r.isApplicable(expenses);
                    System.out.println(
                            "Rule " + r.getClass().getSimpleName()
                                    + " applicable = " + applicable);
                    return applicable;
                })
                .flatMap(r -> {
                    List<InsightSignal> s = r.detectSignals(expenses);
                    System.out.println(
                            r.getClass().getSimpleName()
                                    + " produced signals = "
                                    + s.size());
                    return s.stream();
                })
                .toList();

        System.out.println("TOTAL SIGNALS = " + signals.size());

        if (signals.isEmpty()) {
            System.out.println("❌ NO SIGNALS GENERATED");
            return;
        }

        System.out.println("CALLING AGGREGATOR");

        aggregator.processSignals(signals);

        System.out.println("=== INSIGHT GENERATION FINISHED ===");
    }

}
