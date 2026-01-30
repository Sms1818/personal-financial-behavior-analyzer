package com.sahil.pfba.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sahil.pfba.controller.dto.RegisterRequest;
import com.sahil.pfba.controller.dto.RegisterResponse;
import com.sahil.pfba.domain.Role;
import com.sahil.pfba.domain.User;
import com.sahil.pfba.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword= passwordEncoder.encode(request.getPassword());

        User user= new User(
            request.getEmail(),
            hashedPassword,
            Role.USER
        );

        userRepository.save(user);

        return new RegisterResponse(user.getId(), user.getEmail());
    }
    
}
