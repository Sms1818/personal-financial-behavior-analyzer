package com.sahil.pfba.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sahil.pfba.insights.InsightGenerationService;

@RestController
@RequestMapping("/api/insights")
public class InsightGenerationController {

    private final InsightGenerationService service;

    public InsightGenerationController(
            InsightGenerationService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public Map<String, Object> generateInsights() {
        service.generate();
        return Map.of(
                "status", "success",
                "message", "Insights generated successfully");
    }

}
