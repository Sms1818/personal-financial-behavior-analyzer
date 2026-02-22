package com.sahil.pfba.controller.dto;

import java.time.LocalDateTime;

import com.sahil.pfba.domain.Role;

public record UserProfileDto(
        String email,
        Role role,
        LocalDateTime createdAt) {
}
