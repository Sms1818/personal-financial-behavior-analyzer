package com.sahil.pfba.insights.signal;

import java.util.Map;

import com.sahil.pfba.insights.InsightType;

public class InsightSignal {

    private final InsightType type;
    private final String source;
    private final Map<String, Object> evidence;

    public InsightSignal(
            InsightType type,
            String source,
            Map<String, Object> evidence
    ) {
        this.type = type;
        this.source = source;
        this.evidence = evidence;
    }

    public InsightType getType() {
        return type;
    }

    public String getSource() {
        return source;
    }

    public Map<String, Object> getEvidence() {
        return evidence;
    }
}
