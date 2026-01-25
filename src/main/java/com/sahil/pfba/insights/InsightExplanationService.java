package com.sahil.pfba.insights;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InsightExplanationService {

    private final InsightRepository insightRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public InsightExplanationService(InsightRepository insightRepository) {
        this.insightRepository = insightRepository;
    }

    public InsightExplanation getStructuredExplanation(String insightId) {
        Insight insight = insightRepository.findById(insightId)
                .orElseThrow();

        try {
            return objectMapper.readValue(
                    insight.getExplanation(),
                    InsightExplanation.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid explanation JSON", e);
        }
    }
}
