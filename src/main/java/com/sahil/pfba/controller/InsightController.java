package com.sahil.pfba.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.controller.dto.InsightResponse;
import com.sahil.pfba.insights.InsightExplanationService;
import com.sahil.pfba.insights.InsightGenerationService;
import com.sahil.pfba.insights.InsightRepository;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightRepository repository;
    private final InsightGenerationService service;
    private final InsightExplanationService explanationService;

    public InsightController(
            InsightRepository repository,
            InsightGenerationService service,
            InsightExplanationService explanationService) {
        this.repository = repository;
        this.service = service;
        this.explanationService = explanationService;
    }

    @PostMapping("/generate")
    public void generate() {
        service.generate();
    }

    @GetMapping
    public ResponseEntity<List<InsightResponse>> getAllInsights() {

        return ResponseEntity.ok(
                repository.findAll().stream()
                        .map(insight -> new InsightResponse(
                                insight.getId(),
                                insight.getType(),
                                insight.getSeverity(),
                                insight.getStatus(),
                                insight.getMessage(),
                                explanationService.getStructuredExplanation(insight.getId()),
                                insight.getCreatedAt()))
                        .toList());
    }

}
