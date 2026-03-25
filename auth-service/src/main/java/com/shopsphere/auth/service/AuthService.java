package com.shopsphere.auth.service;

import com.shopsphere.auth.dto.AuthResponse;
import com.shopsphere.auth.dto.LoginRequest;
import com.shopsphere.auth.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    boolean validateToken(String token);
}
