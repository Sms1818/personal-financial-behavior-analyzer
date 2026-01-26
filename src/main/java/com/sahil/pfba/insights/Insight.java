package com.sahil.pfba.insights;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "insights")
public class Insight {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private InsightType type;

    @Enumerated(EnumType.STRING)
    private InsightSeverity severity;

    @Enumerated(EnumType.STRING)
    private InsightStatus status;

    @Column(nullable = false)
    private String message;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    private LocalDateTime lastEvaluatedAt;

    protected Insight() {
    }

    private Insight(Builder b) {
        this.id = b.id;
        this.type = b.type;
        this.severity = b.severity;
        this.status = b.status;
        this.message = b.message;
        this.createdAt = b.createdAt;
        this.explanation = b.explanation;
        this.lastEvaluatedAt = b.lastEvaluatedAt;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public String getId() {
        return id;
    }

    public InsightType getType() {
        return type;
    }

    public InsightSeverity getSeverity() {
        return severity;
    }

    public InsightStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getExplanation() {
        return explanation;
    }

    public LocalDateTime getLastEvaluatedAt() {
        return lastEvaluatedAt;
    }

    public static class Builder {

        private String id;
        private InsightType type;
        private InsightSeverity severity;
        private InsightStatus status = InsightStatus.ACTIVE;
        private String message;
        private LocalDateTime createdAt = LocalDateTime.now();
        private String explanation;
        private LocalDateTime lastEvaluatedAt;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder type(InsightType type) {
            this.type = type;
            return this;
        }

        public Builder severity(InsightSeverity severity) {
            this.severity = severity;
            return this;
        }

        public Builder status(InsightStatus status) {
            this.status = status;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder explanation(String explanation) {
            this.explanation = explanation;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder lastEvaluatedAt(LocalDateTime lastEvaluatedAt) {
            this.lastEvaluatedAt = lastEvaluatedAt;
            return this;
        }

        public Insight build() {
            return new Insight(this);
        }
    }
}
