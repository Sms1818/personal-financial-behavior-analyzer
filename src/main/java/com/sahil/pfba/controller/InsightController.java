package com.sahil.pfba.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightGenerationService;
import com.sahil.pfba.insights.InsightRepository;
import com.sahil.pfba.service.ExpenseService;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
    private final InsightGenerationService insightGenerationService;
    private final InsightRepository insightRepository;

    public InsightController(ExpenseService expenseService, InsightRepository insightRepository) {
        this.insightGenerationService = new InsightGenerationService(expenseService, insightRepository);
        this.insightRepository = insightRepository;
    }

    @PostMapping("/generate/total")
    public ResponseEntity<Void> generateTotalSpendingInsight(){
        insightGenerationService.generateTotalSpendingInsight();
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Insight>> getAllInsights() {
        return ResponseEntity.ok(insightRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Insight>> getActiveInsights() {
        return ResponseEntity.ok(insightRepository.findActive());
    }

}
