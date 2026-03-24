# ShopSphere E-Commerce Application

A microservices-based e-commerce platform built with Spring Boot.

## Tech Stack

- Java 21
- Spring Boot 3.2.0
- Spring Security with JWT
- MySQL
- Maven

## Current Progress

### Auth Service ✓
- User registration and login
- JWT token generation and validation
- Role-based access control
- BCrypt password encryption

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your credentials
3. Run: `mvn spring-boot:run`

Auth service runs on `http://localhost:8082`

## API Endpoints

**POST** `/auth/signup` - Register new user  
**POST** `/auth/login` - Login existing user  
**GET** `/auth/validate?token={token}` - Validate JWT token

---

*This project demonstrates microservices architecture.*
