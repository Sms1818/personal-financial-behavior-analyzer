package com.sahil.pfba.insights;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true) 
public class InsightExplanation {

        private String summary;
        private List<String> drivers;
        private String impact;
        private List<String> recommendations;
        private double confidence;
        private InsightSeverity severity;
    
        public InsightExplanation() {
        }
    
        public InsightExplanation(
                String summary,
                List<String> drivers,
                String impact,
                List<String> recommendations,
                double confidence,
                InsightSeverity severity
        ) {
            this.summary = summary;
            this.drivers = drivers;
            this.impact = impact;
            this.recommendations = recommendations;
            this.confidence = confidence;
            this.severity = severity;
        }

        public static InsightExplanation fallback() {
                return new InsightExplanation(
                        "Financial pattern detected from your expenses.",
                        List.of(
                                "Transaction patterns triggered this insight.",
                                "Spending distribution exceeded expected thresholds."
                        ),
                        "This behavior may influence your monthly budget and savings.",
                        List.of(
                                "Review recent transactions.",
                                "Add more categorized expenses.",
                                "Track expenses consistently."
                        ),
                        0.6,
                        InsightSeverity.MEDIUM
                );
            }
    
        public String getSummary() {
            return summary;
        }
    
        public List<String> getDrivers() {
            return drivers;
        }
    
        public String getImpact() {
            return impact;
        }
    
        public List<String> getRecommendations() {
            return recommendations;
        }
    
        public double getConfidence() {
            return confidence;
        }
        public InsightSeverity getSeverity() {
            return severity;
        }
    }

    
    