package com.sahil.pfba.insights;

import java.time.LocalDateTime;

public class Insight {
    private final String id;
    private final InsightType type;
    private final InsightSeverity severity;
    private final InsightStatus status;
    private final String message;
    private final LocalDateTime createdAt;
    private final String explanation;


    private Insight(Builder builder){
        this.id = builder.id;
        this.type = builder.type;
        this.severity = builder.severity;
        this.status = builder.status;
        this.message = builder.message;
        this.createdAt = builder.createdAt;
        this.explanation=builder.explanation;
    }

    public String getId(){
        return id;
    }
    public InsightType getType(){
        return type;
    }
    public InsightSeverity getSeverity(){
        return severity;
    }
    public InsightStatus getStatus(){
        return status;
    }
    public String getMessage(){
        return message;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public String getExplanation(){
        return explanation;
    }

    public static class Builder{
        private String id;
        private InsightType type;
        private InsightSeverity severity;
        private InsightStatus status= InsightStatus.ACTIVE;
        private String message;
        private LocalDateTime createdAt= LocalDateTime.now();
        private String explanation;

        public Builder id(String id){
            this.id = id;
            return this;
        }

        public Builder type(InsightType type){
            this.type = type;
            return this;
        }

        public Builder severity(InsightSeverity severity){
            this.severity = severity;
            return this;
        }

        public Builder status(InsightStatus status){
            this.status = status;
            return this;
        }

        public Builder message(String message){
            this.message = message;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt){
            this.createdAt = createdAt;
            return this;
        }
        public Builder explanation(String explanation){
            this.explanation=explanation;
            return this;
        }

        public Insight build(){
            return new Insight(this);
        }

    }

}
