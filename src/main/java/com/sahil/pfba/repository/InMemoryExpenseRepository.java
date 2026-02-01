package com.sahil.pfba.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import com.sahil.pfba.domain.Category;
import com.sahil.pfba.domain.Expense;
import com.sahil.pfba.domain.ExpenseStatus;
import com.sahil.pfba.domain.TransactionType;

@Repository
@Profile("dev")
public class InMemoryExpenseRepository implements ExpenseRepository {

    /**
     * Structure:
     *
     * userId
     *   └── expenseId
     *         └── versions (v1, v2, v3...)
     */
    private final Map<String, Map<String, List<Expense>>> store =
            new ConcurrentHashMap<>();

    // ============================
    // SAVE
    // ============================

    @Override
    public Expense save(Expense expense) {

        String userId = expense.getUser().getId();
        String expenseId = expense.getId();

        store
            .computeIfAbsent(userId, u -> new ConcurrentHashMap<>())
            .computeIfAbsent(expenseId, e -> new ArrayList<>())
            .add(expense);

        return expense;
    }

    @Override
    public void saveAll(String userId,List<Expense> expenses) {
        expenses.forEach(this::save);
    }

    // ============================
    // FIND ALL (LATEST ONLY)
    // ============================

    @Override
    public List<Expense> findAllByUser(String userId) {

        return store.getOrDefault(userId, Map.of())
                .values()
                .stream()
                .map(versions -> versions.get(versions.size() - 1))
                .filter(e -> e.getStatus() == ExpenseStatus.ACTIVE)
                .sorted(Comparator.comparing(Expense::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    // ============================
    // FIND LATEST BY ID
    // ============================

    @Override
    public Optional<Expense> findLatestById(String userId, String expenseId) {

        List<Expense> versions =
                store.getOrDefault(userId, Map.of()).get(expenseId);

        if (versions == null || versions.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(versions.get(versions.size() - 1));
    }

    // ============================
    // HISTORY
    // ============================

    @Override
    public List<Expense> findHistoryById(String userId, String expenseId) {

        return new ArrayList<>(
                store.getOrDefault(userId, Map.of())
                     .getOrDefault(expenseId, List.of())
        );
    }

    // ============================
    // CATEGORY
    // ============================

    @Override
    public List<Expense> findByCategory(String userId, Category category) {

        return findAllByUser(userId)
                .stream()
                .filter(e -> e.getCategory() == category)
                .collect(Collectors.toList());
    }

    // ============================
    // DATE RANGE
    // ============================

    @Override
    public List<Expense> findByDateRange(
            String userId,
            LocalDate start,
            LocalDate end
    ) {
        return findAllByUser(userId)
                .stream()
                .filter(e ->
                        !e.getDate().isBefore(start) &&
                        !e.getDate().isAfter(end)
                )
                .collect(Collectors.toList());
    }

    // ============================
    // TRANSACTION TYPE
    // ============================

    @Override
    public List<Expense> findByType(
            String userId,
            TransactionType type
    ) {
        return findAllByUser(userId)
                .stream()
                .filter(e -> e.getTransactionType() == type)
                .collect(Collectors.toList());
    }
}
