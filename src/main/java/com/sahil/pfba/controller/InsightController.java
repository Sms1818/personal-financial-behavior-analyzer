package com.sahil.pfba.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightRepository;
import com.sahil.pfba.insights.InsightStatus;

@RestController
@RequestMapping("/api/insights")
@PreAuthorize("hasRole('USER')")
public class InsightController {

    private final InsightRepository repository;

    public InsightController(InsightRepository repository) {
        this.repository = repository;
    }

    /* ===============================
       READ
    =============================== */

    @GetMapping
    public List<Insight> getAll(
            @AuthenticationPrincipal String userId
    ) {
        return repository.findByUserId(userId);
    }

    /* ===============================
       ACTIONS
    =============================== */

    @PostMapping("/{id}/acknowledge")
    public void acknowledge(
            @AuthenticationPrincipal String userId,
            @PathVariable String id
    ) {
        updateStatus(userId, id, InsightStatus.ACKNOWLEDGED);
    }

    @PostMapping("/{id}/dismiss")
    public void dismiss(
            @AuthenticationPrincipal String userId,
            @PathVariable String id
    ) {
        updateStatus(userId, id, InsightStatus.DISMISSED);
    }

    @PostMapping("/{id}/resolve")
    public void resolve(
            @AuthenticationPrincipal String userId,
            @PathVariable String id
    ) {
        updateStatus(userId, id, InsightStatus.RESOLVED);
    }

    /* ===============================
       INTERNAL
    =============================== */

    private void updateStatus(
            String userId,
            String insightId,
            InsightStatus status
    ) {
        Insight insight =
                repository
                        .findByIdAndUserId(insightId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Insight not found")
                        );

        Insight updated =
                new Insight.Builder()
                        .id(insight.getId())
                        .userId(userId)
                        .type(insight.getType())
                        .severity(insight.getSeverity())
                        .message(insight.getMessage())
                        .explanation(insight.getExplanation())
                        .status(status)
                        .createdAt(insight.getCreatedAt())
                        .lastEvaluatedAt(LocalDateTime.now())
                        .build();

        repository.save(updated);
    }
}
