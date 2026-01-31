package com.sahil.pfba.auth.jwt;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final Key signingKey;
    private final long jwtExpirationInMillis;

    public JwtService(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.expiration-ms}") long jwtExpirationInMillis
    ){
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.jwtExpirationInMillis = jwtExpirationInMillis;
    }

    public String generateToken(String userId, String email, String role){
        return Jwts.builder()
        .setSubject(userId)
        .addClaims(Map.of(
                "email", email,
                "role", role
        ))
        .setIssuedAt(new Date())
        .setExpiration(
                new Date(System.currentTimeMillis() + jwtExpirationInMillis)
        )
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
    }

    public Claims extractClaims(String token){
        return 
            Jwts
                .parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractedUserId(String token){
        return extractClaims(token).getSubject();
    }

    public String extractedEmail(String token){
        return extractClaims(token).get("email", String.class);
    }
    public String extractedRole(String token){
        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token){
        try {
            extractClaims(token);
            return true;
            
        } catch (Exception e) {
            return false;
        }
    }
}
