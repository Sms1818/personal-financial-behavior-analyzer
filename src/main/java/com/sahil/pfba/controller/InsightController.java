package com.sahil.pfba.controller;

import java.time.LocalDateTime;
import java.util.List;

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
public class InsightController {

    private final InsightRepository repository;

    public InsightController(InsightRepository repository) {
        this.repository = repository;
    }

    /* ===============================
       READ
    =============================== */

    @GetMapping
    public List<Insight> getAll() {
        return repository.findAll();
    }

    /* ===============================
       ACTIONS
    =============================== */

    @PostMapping("/{id}/acknowledge")
    public void acknowledge(@PathVariable String id) {
        updateStatus(id, InsightStatus.ACKNOWLEDGED);
    }

    @PostMapping("/{id}/dismiss")
    public void dismiss(@PathVariable String id) {
        updateStatus(id, InsightStatus.DISMISSED);
    }

    @PostMapping("/{id}/resolve")
    public void resolve(@PathVariable String id) {
        updateStatus(id, InsightStatus.RESOLVED);
    }

    /* ===============================
       INTERNAL
    =============================== */

    private void updateStatus(String id, InsightStatus status) {
        Insight insight = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Insight not found: " + id)
                );

        Insight updated =
                new Insight.Builder()
                        .id(insight.getId())
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
