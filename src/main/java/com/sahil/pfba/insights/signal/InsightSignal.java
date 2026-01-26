package com.sahil.pfba.insights.signal;

import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sahil.pfba.insights.InsightType;

@JsonInclude(JsonInclude.Include.NON_NULL)
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
        this.evidence = sanitize(evidence);
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


    private Map<String, Object> sanitize(
            Map<String, Object> raw
    ) {
        return raw.entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            Object value = entry.getValue();

                            if (value == null) return null;

                            // numbers → double
                            if (value instanceof Number n) {
                                return n.doubleValue();
                            }

                            // enums → string
                            if (value instanceof Enum<?> e) {
                                return e.name();
                            }

                            
                            return value.toString();
                        }
                ));
    }

    @Override
    public String toString() {
        return """
        {
          "type": "%s",
          "source": "%s",
          "evidence": %s
        }
        """.formatted(
                type.name(),
                source,
                evidence.toString()
        );
    }
}
