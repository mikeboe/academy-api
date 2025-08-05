# Authentication API

A complete JWT-based authentication system built with Node.js, Express, PostgreSQL, and Drizzle ORM.

## Features

- **Email & Password Authentication**: Secure user registration and login
- **JWT Tokens**: Access and refresh token system with rotation
- **Password Security**: Argon2 hashing with strong password requirements
- **Email Verification**: User email verification system
- **Password Reset**: Secure password reset functionality
- **Rate Limiting**: Protection against brute force attacks
- **Security**: httpOnly cookies, CORS, and secure headers

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- SMTP server (for email verification and password reset)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Update the following variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_ACCESS_SECRET`: Secret for access tokens (32+ characters)
   - `JWT_REFRESH_SECRET`: Secret for refresh tokens (32+ characters)
   - Email configuration for verification and password reset

3. **Database Setup**:
   ```bash
   # Generate migration
   npx drizzle-kit generate
   
   # Apply migration
   npx drizzle-kit migrate
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

All routes are prefixed with `/api/auth`

#### POST `/register`
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**: User object and verification message

#### POST `/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**: User object + httpOnly cookies set

#### POST `/refresh`
Refresh access token using refresh token from cookies.

**Response**: New tokens set in httpOnly cookies

#### POST `/logout`
Logout and revoke tokens.

**Response**: Success message + cookies cleared

#### GET `/me` (Protected)
Get current authenticated user information.

**Response**: Current user object

#### POST `/verify-email`
Verify user email with token from verification email.

**Request Body**:
```json
{
  "token": "verification-token-from-email"
}
```

#### POST `/forgot-password`
Request password reset email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

#### POST `/reset-password`
Reset password with token from reset email.

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!"
}
```

## Security Features

- **Argon2 password hashing**
- **JWT access tokens** (15 minutes expiry)
- **Refresh token rotation** (7 days expiry)
- **httpOnly cookies** for token storage
- **Rate limiting**:
  - Registration: 5 requests per 15 minutes
  - Login: 10 requests per 15 minutes
  - Password reset: 3 requests per hour
- **Input validation** with Zod schemas
- **CORS configuration**
- **Secure password requirements**

## Database Schema

### Users Table
- `id`: UUID primary key
- `email`: Unique email address
- `passwordHash`: Argon2 hashed password
- `firstName`, `lastName`: User names
- `role`: User role (default: 'student')
- `emailVerified`: Email verification status
- `emailVerificationToken`: Token for email verification
- `passwordResetToken`, `passwordResetExpires`: Password reset tokens
- Timestamps: `createdAt`, `updatedAt`, `lastLogin`

### Refresh Tokens Table
- `id`: UUID primary key
- `userId`: Foreign key to users table
- `tokenHash`: SHA256 hashed refresh token
- `expiresAt`: Token expiration timestamp
- `revokedAt`: Token revocation timestamp
- `replacedByTokenId`: Token rotation tracking

## Password Requirements

Passwords must contain:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# Get user info (using cookies from login)
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

## Development

- `npm run dev`: Start development server with ts-node
- `npx drizzle-kit generate`: Generate database migrations
- `npx drizzle-kit migrate`: Apply database migrations
- `npx tsc --noEmit`: Check TypeScript without compiling

## Next Steps

1. Implement email sending functionality for verification and password reset
2. Add user roles and permissions system
3. Add OAuth providers (Google, GitHub, etc.)
4. Add API documentation with Swagger
5. Add comprehensive test suite
6. Add logging and monitoring