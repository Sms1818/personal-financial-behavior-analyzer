package com.sahil.pfba.rules;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.TransactionType;
import com.sahil.pfba.insights.InsightType;
import com.sahil.pfba.insights.signal.InsightSignal;

@Component
public class CategorySpendingSpikeRule implements InsightRule {

    private static final BigDecimal THRESHOLD =
            new BigDecimal("0.40");

    @Override
    public InsightType getType() {
        return InsightType.CATEGORY_SPIKE;
    }

    @Override
    public boolean isApplicable(List<Expense> debits) {
        return debits != null && debits.size() >= 3;
    }

    @Override
    public List<InsightSignal> detectSignals(
            List<Expense> expenses
    ) {

        // ✅ ONLY spending
        List<Expense> debits =
                expenses.stream()
                        .filter(e ->
                                e.getTransactionType()
                                        == TransactionType.DEBIT
                        )
                        .toList();

        if (debits.isEmpty()) return List.of();

        // ✅ absolute values
        BigDecimal totalSpending =
                debits.stream()
                        .map(Expense::getAmount)
                        .map(BigDecimal::abs)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalSpending.compareTo(BigDecimal.ZERO) == 0) {
            return List.of();
        }

        Map<Category, BigDecimal> perCategory =
                debits.stream()
                        .collect(Collectors.groupingBy(
                                Expense::getCategory,
                                Collectors.mapping(
                                        e -> e.getAmount().abs(),
                                        Collectors.reducing(
                                                BigDecimal.ZERO,
                                                BigDecimal::add
                                        )
                                )
                        ));

        return perCategory.entrySet()
                .stream()
                .filter(entry -> {

                    BigDecimal ratio =
                            entry.getValue()
                                    .divide(
                                            totalSpending,
                                            4,
                                            RoundingMode.HALF_UP
                                    );

                    return ratio.compareTo(THRESHOLD) >= 0;
                })
                .map(entry -> {

                    BigDecimal ratio =
                            entry.getValue()
                                    .divide(
                                            totalSpending,
                                            4,
                                            RoundingMode.HALF_UP
                                    );

                    return new InsightSignal(
                            InsightType.CATEGORY_SPIKE,
                            "CATEGORY:" + entry.getKey().name(),
                            Map.of(
                                    "category", entry.getKey().name(),
                                    "amount", entry.getValue(),
                                    "totalSpending", totalSpending,
                                    "percentage",
                                    ratio.multiply(BigDecimal.valueOf(100))
                            )
                    );
                })
                .toList();
    }
}
