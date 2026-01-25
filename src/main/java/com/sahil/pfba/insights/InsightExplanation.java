package com.sahil.pfba.insights;

import java.util.List;

public record InsightExplanation(
        String summary,
        List<String> drivers,
        String impact,
        List<String> recommendations,
        double confidence
) {}
