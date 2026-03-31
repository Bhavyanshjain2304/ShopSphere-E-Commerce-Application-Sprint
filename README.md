# ShopSphere - Microservices E-Commerce Application

A fully containerized e-commerce backend built with Spring Boot microservices architecture.

## Architecture Overview

```
Client → API Gateway (8222) → Microservices
                    ↓
              Eureka Server (8761) - Service Discovery
              Config Server (8888) - Centralized Config
              RabbitMQ (5672)      - Async Messaging
              Zipkin (9411)        - Distributed Tracing
              MySQL (3307)         - Persistent Storage
```

## Microservices

| Service | Port | Description |
|---|---|---|
| api-gateway | 8222 | Single entry point, routes all requests |
| auth-service | 8082 | JWT authentication, user registration/login |
| catalog-service | 8083 | Products and categories with pagination |
| order-service | 8084 | Cart management and order lifecycle |
| admin-service | 8085 | Admin dashboard, product and order management |
| notification-service | 8086 | Async event consumer for notifications |
| eureka-server | 8761 | Service registry and discovery |
| config-server | 8888 | Centralized configuration management |

## Tech Stack

- Java 21, Spring Boot 3.x / 4.x
- Spring Cloud (Eureka, Config, Gateway, OpenFeign)
- Spring Security + JWT
- Spring Data JPA + MySQL
- RabbitMQ (async messaging)
- Zipkin + Micrometer (distributed tracing)
- Springdoc OpenAPI (Swagger UI)
- Docker + Docker Compose
- Maven

## What Was Built

### Core Features
- JWT-based authentication (signup, login, token validation)
- Product catalog with categories, pagination, search, soft delete
- Shopping cart (add, update, remove, clear)
- Full order lifecycle: cart → checkout → payment → place order
- Admin dashboard with order and product management
- Async notifications via RabbitMQ on user registration and order placement

### Infrastructure
- API Gateway routing all traffic through a single port
- Eureka service discovery — all services auto-register
- Centralized config server for shared configuration
- Docker Compose orchestrating all 11 containers with health checks and dependency ordering

### Inter-Service Communication
- Feign Client in admin-service calling catalog-service and order-service
- Feign Client in order-service calling catalog-service (product verification on add to cart)
- RabbitMQ events: auth-service → notification-service, order-service → notification-service

### Observability
- Zipkin distributed tracing across all services
- Micrometer + Brave for span propagation
- 100% sampling rate for full trace visibility
- Actuator endpoints on all services

### API Documentation
- Swagger UI on each service:
  - Auth: http://localhost:8082/swagger-ui.html
  - Catalog: http://localhost:8083/swagger-ui.html
  - Order: http://localhost:8084/swagger-ui.html
  - Admin: http://localhost:8085/swagger-ui.html

### Testing
- Unit tests for auth-service (7 tests) — signup, login, token validation
- Unit tests for catalog-service (8 tests) — CRUD, soft delete, pagination
- Mockito-based isolation, no DB or Spring context required

## Running the Project

### Prerequisites
- Docker Desktop
- Java 21
- Maven

### Build all services
```bash
cd auth-service && mvn package -DskipTests && cd ..
cd catalog-service && .\mvnw.cmd package -DskipTests && cd ..
cd order-service && .\mvnw.cmd package -DskipTests && cd ..
cd notification-service && .\mvnw.cmd package -DskipTests && cd ..
cd admin-service && .\mvnw.cmd package -DskipTests && cd ..
cd api-gateway && .\mvnw.cmd package -DskipTests && cd ..
```

### Start all containers
```bash
docker-compose up --build -d
```

### Check status
```bash
docker-compose ps
```

## Service URLs

| URL | Description |
|---|---|
| http://localhost:8222/gateway | API Gateway |
| http://localhost:8761 | Eureka Dashboard |
| http://localhost:9411 | Zipkin Tracing |
| http://localhost:15672 | RabbitMQ Management (guest/guest) |
| http://localhost:8888/actuator/health | Config Server Health |

## API Flow (Happy Path)

1. POST /gateway/auth/signup
2. POST /gateway/auth/login
3. POST /gateway/catalog/categories
4. POST /gateway/catalog/products
5. POST /gateway/orders/cart (header: X-User-Email)
6. POST /gateway/orders/orders/checkout/start
7. POST /gateway/orders/orders/payment
8. POST /gateway/orders/orders/place?orderId=1
9. GET  /gateway/orders/orders/my
10. GET  /gateway/admin/admin/dashboard

## Running Tests

```bash
# Auth service
cd auth-service && mvn test

# Catalog service
cd catalog-service && .\mvnw.cmd test
```
