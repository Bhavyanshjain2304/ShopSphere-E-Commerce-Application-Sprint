package com.shopsphere.auth;

import com.shopsphere.auth.dto.LoginRequest;
import com.shopsphere.auth.dto.SignupRequest;
import com.shopsphere.auth.entity.User;
import com.shopsphere.auth.repository.UserRepository;
import com.shopsphere.auth.security.JwtUtil;
import com.shopsphere.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRole(User.Role.CUSTOMER);
    }

    @Test
    void signup_success() {
        SignupRequest req = new SignupRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("mock-token");

        var response = authService.signup(req);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    void signup_duplicateEmail_throws() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@example.com");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.signup(req));
    }

    @Test
    void login_success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(req.getPassword(), mockUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("mock-token");

        var response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
    }

    @Test
    void login_wrongPassword_throws() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("wrongpass");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(req.getPassword(), mockUser.getPassword())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(req));
    }

    @Test
    void login_userNotFound_throws() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nobody@example.com");
        req.setPassword("pass");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(req));
    }
}
