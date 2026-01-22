package com.sahil.pfba.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightExplanationService;
import com.sahil.pfba.insights.InsightGenerationService;
import com.sahil.pfba.insights.InsightRepository;
import com.sahil.pfba.insights.InsightStatus;


@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightGenerationService insightGenerationService;
    private final InsightRepository insightRepository;
    private final InsightExplanationService insightExplanationService;

    public InsightController(
            InsightGenerationService insightGenerationService,
            InsightRepository insightRepository,
            InsightExplanationService insightExplanationService
    ) {
        this.insightGenerationService = insightGenerationService;
        this.insightRepository = insightRepository;
        this.insightExplanationService = insightExplanationService;
    }

    // Generate insights
    @PostMapping("/generate")
    public ResponseEntity<Void> generateInsights() {
        insightGenerationService.generateInsightsAsync();
        return ResponseEntity.accepted().build();
    }

    // Get all insights
    @GetMapping
    public ResponseEntity<List<Insight>> getAllInsights() {
        return ResponseEntity.ok(insightRepository.findAll());
    }

    // Get insights by status (ACTIVE, ACKNOWLEDGED, RESOLVED, DISMISSED)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Insight>> getByStatus(@PathVariable InsightStatus status) {
        return ResponseEntity.ok(insightRepository.findByStatus(status));
    }

    // Update insight status (generic)
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateInsightStatusRequest request
    ) {
        insightRepository.updateInsightStatus(id, request.status());
        return ResponseEntity.noContent().build();
    }

    // Get explanation
    @GetMapping("/{id}/explanation")
    public ResponseEntity<String> getInsightExplanation(@PathVariable String id) {
        return ResponseEntity.ok(insightExplanationService.getExplanation(id));
    }
}
