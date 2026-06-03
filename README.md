# Context-Aware Smart Calendar

A full-stack scheduling application powered by AI. Users can manage tasks and events with intelligent suggestions, natural-language summaries, and priority recommendations provided by an integrated GPT model.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Database](#database)

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Auth      | JWT, OAuth2 (Google)                            |
| AI        | Spring AI · OpenAI GPT-4o-mini                  |
| Database  | MySQL 8 (Docker)                                |
| Frontend  | React, Axios                                    |

---

## Project Structure

```
MG/
├── MG/                          # Spring Boot backend
│   ├── src/main/
│   │   ├── java/project_MG/     # Application source
│   │   ├── frontend/            # React frontend
│   │   └── resources/
│   │       └── application.properties
│   └── build.gradle
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+ / npm
- Docker (for MySQL)

### Environment Variables

Before running the project, create the required environment files from the provided examples.

**Backend** — create `MG/src/main/resources/.env` (or set system environment variables):

```
OPENAI_API_KEY=your_openai_api_key
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_db_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Frontend** — create `MG/src/main/frontend/.env.local`:

```
REACT_APP_BACKEND_API_BASE_URL=http://localhost:8080
REACT_APP_GOOGLE_AUTH_CLIENT_ID=your_google_client_id
```

> **Note:** Never commit `.env` files containing real credentials to version control. Both files are listed in `.gitignore`.

### Running the Backend

**Start the MySQL container:**

```bash
docker run --name MG -e MYSQL_ROOT_PASSWORD=<password> -e MYSQL_DATABASE=db1 -p 3306:3306 -d mysql:8
```

**Run the Spring Boot application:**

```bash
cd MG
./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

### Running the Frontend

```bash
cd MG/src/main/frontend
npm install
npm start
```

The React dev server will be available at `http://localhost:3000` and proxies API requests to port 8080 automatically.

---

## Branch Workflow

```bash
# Sync your branch with the latest changes from master
git fetch origin
git switch frontend   # or: git switch backend
git rebase origin/master
```

---

## Authentication Flow

### 1. Sign Up
1. `POST /user` with `email` and `password`
2. Returns `memberId` (internal database identifier)

### 2. Login
1. `POST /login` with `email` and `password`
2. Returns `accessToken` and `refreshToken`
3. Store both tokens securely (e.g., `localStorage` or an `HttpOnly` cookie)

### 3. Authenticated Requests
- Attach the access token to every request as a Bearer header:
  ```
  Authorization: Bearer <accessToken>
  ```

### 4. Token Refresh
1. When a request returns `401 Unauthorized`, send `POST /jwt/refresh` with the `refreshToken`
2. Receive a new `accessToken` and `refreshToken`
3. Update the stored tokens and retry the original request

---

## API Reference

### User & Auth

| Action                    | Method | Endpoint           | Auth Required | Request Body                  | Response              |
|---------------------------|--------|--------------------|---------------|-------------------------------|-----------------------|
| Sign up                   | POST   | `/user`            | No            | `email`, `password`           | `memberId`            |
| Check email availability  | POST   | `/user/exist`      | No            | `email`                       | `true` / `false`      |
| Login                     | POST   | `/login`           | No            | `email`, `password`           | `accessToken`, `refreshToken` |
| Get profile               | GET    | `/user`            | Yes           | —                             | User object           |
| Update profile            | PUT    | `/user`            | Yes           | `email`, `password`           | `userId`              |
| Delete account            | DELETE | `/user`            | Yes           | `email`                       | `true`                |
| Refresh token (JWT)       | POST   | `/jwt/refresh`     | No            | `refreshToken` (body)         | New tokens            |
| Refresh token (OAuth2)    | POST   | `/jwt/exchange`    | No            | `refreshToken` (cookie)       | New tokens            |

### Tasks

| Action       | Method | Endpoint        | Auth Required | Request Body                                                             | Response             |
|--------------|--------|-----------------|---------------|--------------------------------------------------------------------------|----------------------|
| Create task  | POST   | `/tasks`        | Yes           | `taskName`, `category`, `date`, `startTime`, `endTime`, `description`    | Created task object  |
| Get tasks    | GET    | `/tasks`        | Yes           | —                                                                        | List of task objects |
| Update task  | PUT    | `/tasks/{id}`   | Yes           | `taskName`, `category`, `date`, `startTime`, `endTime`, `description`    | Updated task object  |
| Delete task  | DELETE | `/tasks/{id}`   | Yes           | —                                                                        | `true`               |

---

## Database

- **Engine:** MySQL 8
- **Container name:** `MG`
- **Database:** `db1`
- **Port:** `3306`

**Verify the container is running:**

```bash
docker ps
```

**Connect to the database:**

```bash
docker exec -it MG mysql -u root -p
```
