package com.sahil.pfba.insights;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum InsightSeverity {
    LOW,
    MEDIUM,
    HIGH;

    @JsonCreator
    public static InsightSeverity from(String value) {
        return value == null
                ? MEDIUM
                : InsightSeverity.valueOf(value.toUpperCase());
    }
}
