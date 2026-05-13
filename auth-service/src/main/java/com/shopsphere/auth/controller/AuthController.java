package com.shopsphere.auth.controller;


import com.shopsphere.auth.dto.AuthResponse;
import com.shopsphere.auth.dto.LoginRequest;
import com.shopsphere.auth.dto.SignupRequest;
import com.shopsphere.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<?> signupAdmin(
            @RequestBody SignupRequest request,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        // Admin accounts are seeded automatically on startup.
        // This endpoint is disabled in production.
        return ResponseEntity.status(HttpStatus.GONE)
                .body(Map.of("error", "Admin signup via API is disabled. Admin accounts are provisioned automatically."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validate(@RequestParam String token) {
        return ResponseEntity.ok(Map.of("valid", authService.validateToken(token)));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(authService.getUserByEmail(email));
    }
}
