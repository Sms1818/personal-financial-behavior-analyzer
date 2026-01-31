package com.sahil.pfba.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;
    
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected User(){}

    public User(
        String email,
        String password,
        Role role
    ){
        this.id = UUID.randomUUID().toString();
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }
    public Role getRole() {
        return role;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
