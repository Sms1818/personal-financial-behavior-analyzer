package com.sahil.pfba.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.insights.Insight;
import com.sahil.pfba.insights.InsightGenerationService;
import com.sahil.pfba.insights.InsightRepository;
import com.sahil.pfba.insights.InsightStatus;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
    private final InsightGenerationService insightGenerationService;
    private final InsightRepository insightRepository;

    public InsightController(InsightGenerationService insightGenerationService, InsightRepository insightRepository) {
        this.insightGenerationService = insightGenerationService;
        this.insightRepository = insightRepository;
    }

    @PostMapping("/generate")
    public ResponseEntity<Void> generateInsights(){
        insightGenerationService.generateInsightsAsync();
        return ResponseEntity.accepted().build();
    }

    @GetMapping
    public ResponseEntity<List<Insight>> getAllInsights() {
        return ResponseEntity.ok(insightRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Insight>> getActiveInsights() {
        return ResponseEntity.ok(insightRepository.findActive());
    }

    @PutMapping("{id}/acknowledge")
    public ResponseEntity<Void> acknowledgeInsight(@PathVariable String id){
        insightRepository.updateInsightStatus(id, InsightStatus.ACKNOWLEDGED);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismissInsight(@PathVariable String id) {
        insightRepository.updateInsightStatus(id, InsightStatus.DISMISSED);
        return ResponseEntity.noContent().build();
    }

}
