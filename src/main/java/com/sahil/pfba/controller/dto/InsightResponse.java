package com.sahil.pfba.controller.dto;

import java.time.LocalDateTime;

import com.sahil.pfba.insights.InsightExplanation;
import com.sahil.pfba.insights.InsightSeverity;
import com.sahil.pfba.insights.InsightStatus;
import com.sahil.pfba.insights.InsightType;

public record InsightResponse(
        String id,
        InsightType type,
        InsightSeverity severity,
        InsightStatus status,
        String message,
        InsightExplanation explanation,
        LocalDateTime createdAt
) {}
