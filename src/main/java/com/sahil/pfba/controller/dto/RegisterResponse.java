package com.sahil.pfba.controller.dto;

public class RegisterResponse {
    private final String id;
    private final String email;

    public RegisterResponse(String id, String email) {
        this.id = id;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}
