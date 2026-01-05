package com.sahil.pfba.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sahil.pfba.domain.Category;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UpdateExpenseRequest {

    @NotNull
    public String description;

    @NotNull
    @Positive
    public BigDecimal amount;

    @NotNull
    public Category category;

    @NotNull
    public LocalDate date;
    
}
