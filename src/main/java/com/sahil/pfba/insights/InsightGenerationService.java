package com.sahil.pfba.insights;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class InsightGenerationService {
    private final InsightProcessor insightProcessor;

    public InsightGenerationService(
            InsightProcessor insightProcessor
    ) {
        this.insightProcessor=insightProcessor;
    }

    @Async("analysisExecutor")
    public void generateInsightsAsync() {

        System.out.println(
            "Insight generation running on thread: " +
            Thread.currentThread().getName()
        );

        insightProcessor.generateInsightsTransactional();
    }

}
