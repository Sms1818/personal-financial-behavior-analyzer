package com.sahil.pfba.domain;

import java.io.Serializable;
import java.util.Objects;

public class ExpenseId implements Serializable {
    private String id;
    private int version;

    public ExpenseId() {}

    public ExpenseId(String id, int version) {
        this.id = id;
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExpenseId)) return false;
        ExpenseId that = (ExpenseId) o;
        return version == that.version && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, version);
    }
    
}
