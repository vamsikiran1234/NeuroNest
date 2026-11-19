# NeuroNest — Production Deployment & DevOps Guide

This guide details the containerized deployment, environment configuration, database migrations, and monitoring procedures for **NeuroNest**.

---

## 1. Containerization Architecture

NeuroNest is containerized using multi-stage Docker builds and orchestrated with Docker Compose:

```
                          Internet / User Browser
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │   Frontend (Nginx Alpine) │  Port 3000 / 80
                       │   - Static SPA Bundle     │
                       │   - Reverse Proxy (/api/) │
                       └─────────────┬─────────────┘
                                     │ http://backend:8080
                                     ▼
                       ┌───────────────────────────┐
                       │  Backend (Spring Boot 3)  │  Port 8080
                       │  - Java 21 LTS JRE Alpine │
                       │  - Non-root `neuronest`   │
                       └─────────────┬─────────────┘
                                     │ JDBC
                                     ▼
                       ┌───────────────────────────┐
                       │  PostgreSQL 16 Alpine     │  Port 5432
                       │  - Persistent Volume      │
                       │  - Flyway Migrations V1/V2│
                       └───────────────────────────┘
```

---

## 2. Quickstart with Docker Compose

Ensure Docker and Docker Compose are installed on the host machine.

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/vamsikiran1234/NeuroNest.git
cd NeuroNest
cp .env.example .env
```

Edit `.env` to configure your Gemini API Key (optional):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 2: Build and Launch Containers
```bash
docker-compose up -d --build
```

### Step 3: Verify Container Health
```bash
docker-compose ps
```

The application will be accessible at:
- **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Actuator Health Endpoint**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

## 3. Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` | Spring profile (`dev` for H2/in-memory, `prod` for PostgreSQL). |
| `DB_HOST` | `postgres` | Hostname of the PostgreSQL database service. |
| `DB_PORT` | `5432` | Port of the PostgreSQL database service. |
| `DB_NAME` | `neuronest_db` | Database catalog name. |
| `DB_USERNAME` | `neuronest_user` | PostgreSQL connection username. |
| `DB_PASSWORD` | `neuronest_secure_password` | PostgreSQL connection password. |
| `JWT_SECRET` | *(64-char hex key)* | Secret key for HMAC-SHA256 signature verification. |
| `JWT_EXPIRATION_MS` | `900000` (15 mins) | Access token lifespan. |
| `JWT_REFRESH_EXPIRATION_MS`| `604800000` (7 days) | Rotating refresh token lifespan. |
| `GEMINI_API_KEY` | *(empty)* | Optional Google Gemini API key. Fallbacks trigger if unset. |
| `AI_MODEL` | `gemini-1.5-flash` | Gemini model identifier. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed origins for CORS filter. |

---

## 4. Multi-Stage Dockerfile Security

### Backend (`backend/Dockerfile`)
- **Stage 1 (Build)**: `maven:3.9.9-eclipse-temurin-21-alpine` pre-fetches dependencies and compiles the fat JAR with unit tests skipped for clean container build.
- **Stage 2 (Runtime)**: `eclipse-temurin:21-jre-alpine` lightweight base image.
- **Least Privilege Principle**: A dedicated non-root user `neuronest:neuronest` is created and assigned as the active execution context to prevent privilege escalation attacks.

### Frontend (`frontend/Dockerfile`)
- **Stage 1 (Build)**: `node:20-alpine` runs `npm ci` and `npm run build` to generate optimized production chunks.
- **Stage 2 (Runtime)**: `nginx:alpine` serving static content through an optimized `nginx.conf` with automatic SPA history mode fallback and API reverse proxy forwarding.

---

## 5. Health Monitoring & Maintenance

### Actuator Health Check
The backend exposes Spring Boot Actuator at `/actuator/health`. When running with the `prod` profile, it validates:
- Database connectivity (`db: UP`)
- Disk space availability (`diskSpace: UP`)
- Application status (`status: UP`)

### Docker Compose Healthcheck
PostgreSQL is configured with an automated health check:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U neuronest_user -d neuronest_db"]
  interval: 10s
  timeout: 5s
  retries: 5
```
The backend service specifies `condition: service_healthy`, ensuring the database is fully initialized and receptive before Spring Boot starts Flyway migrations.
