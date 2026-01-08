package com.sahil.pfba.audit;

import java.time.LocalDateTime;

public class ImportAudit {

    private final String id;
    private final String fileName;
    private final ImportType importType;
    private final ImportStatus status;

    private final int totalRecords;
    private final int successCount;
    private final int failureCount;

    private final LocalDateTime startedAt;
    private final LocalDateTime completedAt;

    public String getId() {
        return id;
    }
    public String getFileName() {
        return fileName;
    }
    public ImportType getImportType() {
        return importType;
    }
    public ImportStatus getStatus() {
        return status;
    }
    public int getTotalRecords() {
        return totalRecords;
    }
    public int getSuccessCount() {
        return successCount;
    }
    public int getFailureCount() {
        return failureCount;
    }
    public LocalDateTime getStartedAt() {
        return startedAt;
    }
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    private ImportAudit(Builder builder){
        this.id = builder.id;
        this.fileName = builder.fileName;
        this.importType = builder.importType;
        this.status = builder.status;
        this.totalRecords = builder.totalRecords;
        this.successCount = builder.successCount;
        this.failureCount = builder.failureCount;
        this.startedAt = builder.startedAt;
        this.completedAt = builder.completedAt;
    }

    public static class Builder{
        private String id;
        private String fileName;
        private ImportType importType;
        private ImportStatus status;

        private int totalRecords;
        private int successCount;
        private int failureCount;

        private LocalDateTime startedAt;
        private LocalDateTime completedAt;

        public Builder id(String id){
            this.id = id;
            return this;
        }
        public Builder fileName(String fileName){
            this.fileName = fileName;
            return this;
        }
        public Builder importType(ImportType importType){
            this.importType = importType;
            return this;
        }
        public Builder status(ImportStatus status){
            this.status = status;
            return this;
        }
        public Builder totalRecords(int totalRecords){
            this.totalRecords = totalRecords;
            return this;
        }
        public Builder successCount(int successCount){
            this.successCount = successCount;
            return this;
        }  
        public Builder failureCount(int failureCount){
            this.failureCount = failureCount;
            return this;
        }
        public Builder startedAt(LocalDateTime startedAt){
            this.startedAt = startedAt;
            return this;
        }
        public Builder completedAt(LocalDateTime completedAt){
            this.completedAt = completedAt;
            return this;
        }

        public ImportAudit build(){
            return new ImportAudit(this);
        }


    }
    
}
