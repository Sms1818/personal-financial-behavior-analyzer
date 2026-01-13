package com.sahil.pfba.insights;

import org.springframework.stereotype.Service;

@Service
public class InsightExplanationService {
    private final InsightRepository insightRepository;

    public InsightExplanationService(InsightRepository insightRepository) {
        this.insightRepository = insightRepository;
    }

    public String getExplanation(String insightId) {
        Insight insight = insightRepository.findById(insightId)
                .orElseThrow(() -> new RuntimeException("Insight not found"));

        if (insight.getExplanation() == null) {
            return "Explanation not available yet.";
        }

        return insight.getExplanation();
    }

    
}
    

