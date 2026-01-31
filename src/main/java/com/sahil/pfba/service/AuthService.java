package com.sahil.pfba.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sahil.pfba.auth.jwt.JwtService;
import com.sahil.pfba.controller.dto.LoginRequest;
import com.sahil.pfba.controller.dto.RegisterRequest;
import com.sahil.pfba.controller.dto.RegisterResponse;
import com.sahil.pfba.domain.Role;
import com.sahil.pfba.domain.User;
import com.sahil.pfba.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    public String login(LoginRequest request){
        User user=userRepository.findByEmail(request.email())
            .orElseThrow(()-> new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(request.password(),user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        } 
        return jwtService.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole().name()
        );

    }
    
}
