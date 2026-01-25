package com.sahil.pfba.insights;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class InsightGenerationService {

    private final InsightProcessor processor;

    public InsightGenerationService(
            InsightProcessor processor
    ) {
        this.processor = processor;
    }

    @Transactional
    public void generate() {
        processor.generate();
    }
}

