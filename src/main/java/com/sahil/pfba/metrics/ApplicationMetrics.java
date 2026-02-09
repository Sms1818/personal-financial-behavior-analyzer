package com.sahil.pfba.metrics;

import java.util.concurrent.Callable;

import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

@Component
public class ApplicationMetrics {
    private final Counter expenseCreatedCounter;
    private final Counter csvUploadCounter;
    private final Counter insightGeneratedCounter;
    private final Counter loginSuccessCounter;
    private final Counter loginFailureCounter;

    private final Timer insightGenerationTimer;

    public ApplicationMetrics(MeterRegistry meterRegistry) {
        this.expenseCreatedCounter = Counter.builder("pfba.expense.created")
                .description("Total expense created")
                .register(meterRegistry);

        this.csvUploadCounter = Counter.builder("pfba.csv.upload")
                .description("CSV uploads")
                .register(meterRegistry);

        this.insightGeneratedCounter = Counter.builder("pfba.insight.generated")
                .description("Insights generated")
                .register(meterRegistry);

        this.loginSuccessCounter = Counter.builder("pfba.auth.login.success")
                .register(meterRegistry);

        this.loginFailureCounter = Counter.builder("pfba.auth.login.failure")
                .register(meterRegistry);

        this.insightGenerationTimer = Timer.builder("pfba.insight.generation.time")
                .description("Insight generation time")
                .register(meterRegistry);
    }

    public void expenseCreated() {
        expenseCreatedCounter.increment();
    }

    public void csvUploaded() {
        csvUploadCounter.increment();
    }

    public void insightGenerated() {
        insightGeneratedCounter.increment();
    }

    public void loginSuccess() {
        loginSuccessCounter.increment();
    }

    public void loginFailure() {
        loginFailureCounter.increment();
    }

    public <T> T recordInsightTime(Callable<T> task) throws Exception {
        return insightGenerationTimer.recordCallable(task);
    }

}
