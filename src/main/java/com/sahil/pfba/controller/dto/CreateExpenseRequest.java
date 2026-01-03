package com.sahil.pfba.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sahil.pfba.domain.Category;

public class CreateExpenseRequest {
    public String id;
    public String description;
    public BigDecimal amount;
    public Category category;
    public LocalDate date;
    
}
