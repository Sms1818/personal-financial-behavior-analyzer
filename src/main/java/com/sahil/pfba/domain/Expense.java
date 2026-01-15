package com.sahil.pfba.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    private String id;
    private String description;
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private Category category;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private ExpenseStatus status;
    private int version;

    protected Expense() {
        
    }

    private Expense(Builder builder){
        this.id=builder.id;
        this.description = builder.description;
        this.amount = builder.amount;
        this.category = builder.category;
        this.date = builder.date;
        this.status=builder.status;
        this.version=builder.version;
    }
    
    public String getId(){
        return id;
    }
    public String getDescription() {
        return description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Category getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }

    public ExpenseStatus getStatus() {
        return status;
    }

    public int getVersion(){
        return version;
    }

    public static class Builder {
        private String id;
        private String description;
        private BigDecimal amount;
        private Category category;
        private LocalDate date;
        private ExpenseStatus status= ExpenseStatus.ACTIVE;
        private int version=1;

        public Builder id(String id){
            this.id=id;
            return this;

        }

        public Builder description(String description){
            this.description=description;
            return this;
        }
        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public Builder category(Category category) {
            this.category = category;
            return this;
        }

        public Builder date(LocalDate date) {
            this.date = date;
            return this;
        }

        public Builder status(ExpenseStatus status) {
            this.status = status;
            return this;
        }

        public Builder version(int version){
            this.version=version;
            return this;
        }

        public Expense build() {
            Objects.requireNonNull(id, "id must not be null");
            Objects.requireNonNull(amount, "amount must not be null");
            Objects.requireNonNull(category, "category must not be null");
            Objects.requireNonNull(date, "date must not be null");
            Objects.requireNonNull(status, "status must not be null");
            if (version <= 0) {
                throw new IllegalArgumentException("Version must be positive");
            }
            return new Expense(this);
        }
    }

    @Override
    public boolean equals(Object o){
        if(this==o) return true;
        if(o==null || getClass()!=o.getClass()) return false;
        Expense expense=(Expense) o;
        return id.equals(expense.id);
    }

    @Override
    public int hashCode(){
        return id.hashCode();
    }
}
