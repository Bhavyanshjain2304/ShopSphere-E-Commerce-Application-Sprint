# ShopSphere — Microservices E-Commerce Application

A full-stack e-commerce platform built with a **Spring Boot microservices backend** and a **React frontend**. Every service runs in Docker, communicates through an API Gateway, and the whole stack starts with a single command.

---

## Live Architecture

```
React Frontend (3000)
        │
        ▼
API Gateway (8222)  ←── JWT Auth Filter + Role Guard
        │
        ├──→ auth-service    (8082)  — Signup, Login, JWT
        ├──→ catalog-service (8083)  — Products, Categories
        ├──→ order-service   (8084)  — Cart, Checkout, Orders
        └──→ admin-service   (8085)  — Dashboard, Analytics
                │                           │
                └── Feign ──────────────────┘
                        (admin calls catalog & order)

Infrastructure
├── Eureka Server   (8761)  — Service Discovery
├── Config Server   (8888)  — Centralized Config
├── RabbitMQ        (5672)  — Async Messaging
├── Zipkin          (9411)  — Distributed Tracing
└── MySQL           (3307)  — Persistent Storage

Async Events (RabbitMQ)
├── auth-service    ──→ user.registered.queue  ──→ notification-service
├── order-service   ──→ order.placed.queue     ──→ notification-service
└── order-service   ──→ order.status.queue     ──→ notification-service
```

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 8222 | Single entry point — JWT validation, role guard, routing |
| `auth-service` | 8082 | User signup/login, JWT generation, admin seeding |
| `catalog-service` | 8083 | Products and categories — CRUD, pagination, search, soft delete |
| `order-service` | 8084 | Cart management, checkout flow, payment, order lifecycle |
| `admin-service` | 8085 | Admin dashboard, analytics, product and order management |
| `notification-service` | 8086 | RabbitMQ consumer — logs welcome emails and order confirmations |
| `eureka-server` | 8761 | Service registry — all services auto-register here |
| `config-server` | 8888 | Centralized configuration management |

---

## Tech Stack

**Backend**
- Java 21, Spring Boot 3.x
- Spring Cloud — Eureka, Config Server, Gateway, OpenFeign
- Spring Security + JWT (JJWT)
- Spring Data JPA + MySQL
- RabbitMQ + Spring AMQP
- Zipkin + Micrometer (distributed tracing)
- Springdoc OpenAPI (Swagger UI)
- Docker + Docker Compose
- Maven

**Frontend**
- React 18
- React Router v6
- Axios (with JWT interceptor)
- Recharts (analytics charts)
- Tailwind CSS

**Testing**
- JUnit 5 + Mockito
- 15 unit tests across auth-service and catalog-service

---

## Features

### Customer
- Register and login with JWT authentication
- Browse products with pagination, search, and category filter
- Add to cart, update quantities, remove items
- Full checkout flow — address → delivery mode → payment → place order
- View order history and live order status tracking

### Admin
- Secure admin-only routes (role guard at gateway level)
- Dashboard with KPI cards — total revenue, orders, delivered, pending, cancelled, today's orders
- Revenue trend chart (last 6 months) and order status pie chart
- Manage products — create, update, soft delete
- Manage orders — view all, update status (triggers RabbitMQ notification)
- Reports page with detailed analytics table

### Infrastructure
- All traffic through a single port (8222) — nothing else is exposed to the frontend
- JWT validated at the gateway — downstream services receive `X-User-Email` and `X-User-Role` headers
- Async notifications decoupled from business logic via RabbitMQ
- Durable queues — messages survive broker restarts
- Distributed tracing — every request gets a trace ID across all services
- Docker Compose with health checks and proper startup ordering

---

## Project Structure

```
ShopSphere/
├── api-gateway/              # Spring Cloud Gateway + JWT filter
├── auth-service/             # Authentication + user management
├── catalog-service/          # Product catalog
├── order-service/            # Cart + order lifecycle + analytics queries
├── admin-service/            # Admin API (Feign client to catalog + order)
├── notification-service/     # RabbitMQ consumer
├── eureka-server/            # Service discovery
├── config-server/            # Centralized config
├── frontend/                 # React app
├── docker-compose.yml        # Full stack orchestration
└── .env.example              # Environment variable template
```

---

## Getting Started

### Prerequisites
- Docker Desktop (running)
- Java 21
- Maven

### 1. Clone the repo
```bash
git clone https://github.com/Bhavyanshjain2304/ShopSphere-E-Commerce-Application-Sprint.git
cd ShopSphere-E-Commerce-Application-Sprint
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your DB password and JWT secret
```

### 3. Build all services
```bash
cd auth-service && mvn package -DskipTests && cd ..
cd catalog-service && mvnw.cmd package -DskipTests && cd ..
cd order-service && mvnw.cmd package -DskipTests && cd ..
cd notification-service && mvnw.cmd package -DskipTests && cd ..
cd admin-service && mvnw.cmd package -DskipTests && cd ..
cd api-gateway && mvnw.cmd package -DskipTests && cd ..
cd eureka-server && mvnw.cmd package -DskipTests && cd ..
cd config-server && mvnw.cmd package -DskipTests && cd ..
```

### 4. Start everything
```bash
docker-compose up --build -d
```

### 5. Start the frontend
```bash
cd frontend
npm install
npm start
```

### 6. Verify
```bash
docker-compose ps
```

All 10 containers should show as running. Give it ~30 seconds for all services to register with Eureka.

---

## Service URLs

| URL | What it is |
|---|---|
| http://localhost:3000 | React frontend |
| http://localhost:8222/gateway | API Gateway (all API calls go here) |
| http://localhost:8761 | Eureka Dashboard — see all registered services |
| http://localhost:15672 | RabbitMQ Management UI (guest / guest) |
| http://localhost:9411 | Zipkin — distributed trace viewer |
| http://localhost:8888/actuator/health | Config Server health |

### Swagger UI (per service)
| Service | URL |
|---|---|
| auth-service | http://localhost:8082/swagger-ui.html |
| catalog-service | http://localhost:8083/swagger-ui.html |
| order-service | http://localhost:8084/swagger-ui.html |
| admin-service | http://localhost:8085/swagger-ui.html |

---

## API Flow (Happy Path)

```
1.  POST   /gateway/auth/signup                        Register user
2.  POST   /gateway/auth/login                         Get JWT token
3.  POST   /gateway/catalog/categories                 Create category (admin)
4.  POST   /gateway/catalog/products                   Create product (admin)
5.  GET    /gateway/catalog/products                   Browse products (public)
6.  POST   /gateway/orders/cart                        Add to cart
7.  POST   /gateway/orders/orders/checkout/start       Start checkout
8.  POST   /gateway/orders/orders/payment              Process payment
9.  POST   /gateway/orders/orders/place?orderId=1      Place order
10. GET    /gateway/orders/orders/my                   View order history
11. GET    /gateway/admin/dashboard                    Admin analytics (ADMIN only)
12. PUT    /gateway/admin/orders/{id}/status           Update order status (ADMIN only)
```

---

## How to Trace Any Feature

Every feature follows this exact path:

```
UI Component → api/*.js → API Gateway → Controller → Service → Repository
```

| UI File | API File | Routes To | Logic In |
|---|---|---|---|
| `Login.jsx` | `authApi.js` | auth-service | `AuthServiceImpl` |
| `Signup.jsx` | `authApi.js` | auth-service | `AuthServiceImpl` |
| `Products.jsx` | `catalogApi.js` | catalog-service | `ProductServiceImpl` |
| `Cart.jsx` | `orderApi.js` | order-service | `CartServiceImpl` |
| `Checkout.jsx` | `orderApi.js` | order-service | `OrderServiceImpl` |
| `admin/Dashboard.jsx` | `adminApi.js` | admin-service → order-service | `OrderServiceImpl` + `OrderRepository` |
| `admin/Products.jsx` | `adminApi.js` | admin-service → catalog-service | `ProductServiceImpl` |
| `admin/Orders.jsx` | `adminApi.js` | admin-service → order-service | `OrderServiceImpl` |

---

## RabbitMQ Event Flow

```
User signs up
  └── auth-service publishes UserRegisteredEvent
        └── notification-service logs welcome message

Order placed
  └── order-service publishes OrderPlacedEvent
        └── notification-service logs order confirmation

Admin updates order status
  └── order-service publishes OrderStatusChangedEvent
        └── notification-service logs status change
```

Events are JSON-serialized via `Jackson2JsonMessageConverter`. Queues are durable.

---

## Exception Handling

Each service has a `@RestControllerAdvice` `GlobalExceptionHandler`. All errors return a consistent `ApiResponse` shape:

```json
{
  "success": false,
  "message": "Product not found with id: 42",
  "data": null
}
```

| Exception | HTTP Status | Thrown When |
|---|---|---|
| `ResourceNotFoundException` | 404 | Entity not found in DB |
| `BadRequestException` | 400 | Business rule violation (empty cart, wrong status, access denied) |
| `MethodArgumentNotValidException` | 400 | `@Valid` fails on request body |
| `Exception` (fallback) | 500 | Unexpected server error |

---

## Testing

```bash
# auth-service — 7 tests
cd auth-service && mvn test

# catalog-service — 8 tests
cd catalog-service && mvnw.cmd test
```

**auth-service tests** — `AuthServiceTest.java`
- `signup_Success`
- `signup_EmailAlreadyExists_ThrowsException`
- `login_Success`
- `login_UserNotFound_ThrowsException`
- `login_WrongPassword_ThrowsException`
- `validateToken_ValidToken_ReturnsTrue`
- `validateToken_InvalidToken_ReturnsFalse`

**catalog-service tests** — `ProductServiceTest.java`
- `createProduct_Success`
- `createProduct_CategoryNotFound_ThrowsException`
- `getProduct_Success`
- `getProduct_NotFound_ThrowsException`
- `updateProduct_Success`
- `deleteProduct_SoftDelete_Success`
- `deleteProduct_NotFound_ThrowsException`
- `getAllProducts_ReturnsPaginatedResults`

All tests use JUnit 5 + Mockito. No Spring context or database required — pure unit isolation.

---

## Default Admin Account

On first startup, `AdminSeeder` creates a default admin user:

```
Email:    admin@shopsphere.com
Password: admin123
Role:     ADMIN
```

Use these credentials to log in and access the admin panel at `/admin`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `SPRING_DATASOURCE_URL` | MySQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `JWT_SECRET` | HMAC-SHA256 key (min 256 bits) |
| `SPRING_RABBITMQ_HOST` | RabbitMQ hostname |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | Eureka server URL |

See `.env.example` for a full template.
