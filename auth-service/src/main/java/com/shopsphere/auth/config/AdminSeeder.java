package com.shopsphere.auth.config;

import com.shopsphere.auth.entity.User;
import com.shopsphere.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN user on application startup if none exists.
 *
 * Production note: Override credentials via environment variables:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 * Or use a secrets manager (AWS Secrets Manager, Vault, etc.)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(User.Role.ADMIN)) {
            log.info("Admin user already exists — skipping seeding.");
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setName(adminName);
        admin.setRole(User.Role.ADMIN);

        userRepository.save(admin);
        log.info("Default admin user created: {}", adminEmail);
    }
}
