package com.sahil.pfba.controller.dto;

public class RegisterResponse {
    private String id;
    private String email;

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
