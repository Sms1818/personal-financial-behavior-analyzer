package com.sahil.pfba.insights;

import com.fasterxml.jackson.databind.ObjectMapper;

public final class JsonUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    private JsonUtil() {}

    public static String toJson(Object value) {
        try {
            return mapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to serialize JSON",
                    e
            );
        }
    }
}
