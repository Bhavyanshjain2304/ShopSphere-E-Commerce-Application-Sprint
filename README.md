# ShopSphere E-Commerce Application

A microservices-based e-commerce platform built with Spring Boot.

## Tech Stack

- Java 21
- Spring Boot 3.2.0 / 4.0.4
- Spring Cloud (Eureka, Gateway)
- Spring Security with JWT
- MySQL
- Maven

## Services

### Eureka Server (port 8761)
Service discovery - all microservices register here.

### API Gateway (port 8222)
Single entry point for all client requests. Routes traffic to the appropriate microservice via Eureka.

### Auth Service (port 8082)
Handles user authentication and authorization.
- User registration and login
- JWT token generation and validation
- Role-based access control (CUSTOMER, ADMIN)
- BCrypt password encryption
- SOLID principles with interface-based service layer

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your credentials
3. Start services in this order:
   ```bash
   cd eureka-server && mvn spring-boot:run
   cd auth-service && mvn spring-boot:run
   cd api-gateway && mvn spring-boot:run
   ```

## API Endpoints

All requests go through the gateway at `http://localhost:8222`

**POST** `/auth/signup` - Register new user
**POST** `/auth/login` - Login existing user
**GET** `/auth/validate?token={token}` - Validate JWT token

---

*This project demonstrates microservices architecture.*
