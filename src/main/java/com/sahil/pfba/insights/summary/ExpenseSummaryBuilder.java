package com.sahil.pfba.insights.summary;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.sahil.pfba.domain.Expense;

public class ExpenseSummaryBuilder {
    public static ExpenseSummary build(List<Expense> expenses) {

        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal average = expenses.isEmpty()
            ? BigDecimal.ZERO
            : total.divide(
                BigDecimal.valueOf(expenses.size()),
                2,
                RoundingMode.HALF_UP
            );
        

        Map<String, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().name(),
                        Collectors.mapping(
                            Expense::getAmount,
                            Collectors.reducing(
                                BigDecimal.ZERO,
                                BigDecimal::add
                            ))
                        ));

        Map<String, Long> categoryCounts = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().name(),
                        Collectors.counting()));

        List<LargeExpense> largest = expenses.stream()
                .sorted(Comparator.comparing(Expense::getAmount).reversed())
                .limit(5)
                .map(e -> new LargeExpense(
                        e.getAmount().doubleValue(),
                        e.getCategory().name(),
                        e.getDescription()))
                .toList();

                return new ExpenseSummary(
                    total.doubleValue(),
                    average.doubleValue(),
                    expenses.size(),
                    categoryTotals.entrySet().stream()
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    e -> e.getValue().doubleValue()
                            )),
                    categoryCounts,
                    largest
            );
    }
}
