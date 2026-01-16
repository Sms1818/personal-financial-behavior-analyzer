package com.sahil.pfba.insights;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class InsightScheduler {
    private final InsightGenerationService insightGenerationService;

    public InsightScheduler(InsightGenerationService insightGenerationService) {
        this.insightGenerationService = insightGenerationService;
    }

    // Runs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void runInsightGeneration() {
        System.out.println("Scheduled insight generation triggered");
        insightGenerationService.generateInsightsAsync();
    }
}
