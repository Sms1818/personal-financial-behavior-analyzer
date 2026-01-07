package com.sahil.pfba.bulk;

public class BulkUploadError {
    private final int rowNumber;
    private final String reason;

    public BulkUploadError(int rowNumber, String reason) {
        this.rowNumber = rowNumber;
        this.reason = reason;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public String getReason() {
        return reason;
    }
    
}
