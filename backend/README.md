# Authentication API - Sprint 1

Backend API สำหรับ Authentication System ตาม Sprint 1 Plan

## Features

- **User Registration** - สมัครสมาชิกด้วย email และ password
- **User Login** - เข้าสู่ระบบด้วย email และ password
- **JWT Authentication** - Access token (15 นาที) + Refresh token (7 วัน)
- **User Profile** - ดูและแก้ไขข้อมูลผู้ใช้
- **Secure Logout** - Revoke refresh token

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 14+
- **Auth:** JWT + bcrypt
- **Validation:** express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database config & migrations
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth & error middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── app.ts          # Application entry
├── tests/              # Unit & integration tests
├── package.json
├── tsconfig.json
└── .env.example
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| POST | `/api/auth/logout` | ออกจากระบบ |
| POST | `/api/auth/refresh` | Refresh token |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | ดูข้อมูลตัวเอง | ✅ |
| PUT | `/api/users/me` | แก้ไขข้อมูลตัวเอง | ✅ |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup PostgreSQL

#### Using Docker:

```bash
docker run -d \
  --name auth-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=auth_db \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Or install locally:

```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb auth_db
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Testing

### Run Unit Tests

```bash
npm test
```

### Run API Integration Tests

```bash
# Start the server first
npm run dev

# In another terminal
npm run test:api
```

## API Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully"
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh_token>"
  }'
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh_token>"
  }'
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | auth_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_ACCESS_EXPIRY` | Access token expiry | 15m |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | 7d |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:api` | Run API integration tests |
| `npm run db:migrate` | Run database migrations |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT with expiration
- Refresh token rotation
- Token blacklisting on logout
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Soft delete for users

## License

MIT