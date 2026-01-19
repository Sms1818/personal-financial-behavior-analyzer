package com.sahil.pfba.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sahil.pfba.domain.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateExpenseRequest {

    @NotBlank(message = "Description must not be blank")
    public String description;

    @NotNull(message = "Amount must not be null")
    @Positive(message = "Amount must be positive")
    public BigDecimal amount;

    @NotNull(message = "Category must not be null")
    public Category category;

    @NotNull(message = "Date must not be null")
    public LocalDate date;
    
}
