# ShopSphere E-Commerce - Auth Service

A Spring Boot microservice for user authentication and authorization using JWT tokens.

## Features

- User registration (signup)
- User login with JWT token generation
- Token validation
- Role-based access control (CUSTOMER role)
- MySQL database integration
- RESTful API endpoints

## Tech Stack

- Java 21
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT (JSON Web Tokens)
- Lombok
- Maven

## Prerequisites

- JDK 21 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup

1. Clone the repository
2. Create a MySQL database named `shopsphere_auth` (or it will be created automatically)
3. Copy `.env.example` to `.env` and configure your database credentials:
   ```
   DB_URL=jdbc:mysql://localhost:3306/shopsphere_auth?createDatabaseIfNotExist=true
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key_here
   ```
4. Set environment variables or use default values in `application.yml`
5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The service will start on `http://localhost:8082`

## API Endpoints

### 1. Signup
**POST** `/auth/signup`

Request Body:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
}
```

### 2. Login
**POST** `/auth/login`

Request Body:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
}
```

### 3. Validate Token
**GET** `/auth/validate?token={jwt_token}`

Response:
```json
{
    "valid": true
}
```

## Security Notes

- Passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours (configurable)
- Never commit sensitive credentials to version control
- Use environment variables for production deployments

## Project Structure

```
auth-service/
├── src/
│   ├── main/
│   │   ├── java/com/shopsphere/auth/
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # Data repositories
│   │   │   ├── security/         # Security configuration
│   │   │   ├── service/          # Business logic
│   │   │   └── exception/        # Exception handlers
│   │   └── resources/
│   │       └── application.yml   # Configuration
│   └── test/                     # Unit tests
└── pom.xml                       # Maven dependencies
```

## License

This is a learning/demo project.
