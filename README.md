# OmniLogistics ERP

> **Enterprise Resource Planning System** built with **N-Tier Architecture**.
> Featuring a NestJS Backend, Next.js Admin Dashboard, and React Native Mobile App.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-green.svg)

---

## 🏗 Architecture Overview

This repository uses a **Monorepo** structure managed by **TurboRepo**.

| Tier | Technology Stack | Location | Port |
| :--- | :--- | :--- | :--- |
| **Logic (API)** | **NestJS**, Prisma, PostgreSQL, Redis | `apps/api` | `3000` |
| **Client (Web)** | **Next.js 16**, Tailwind CSS 4 | `apps/web` | `3001` |
| **Client (Mobile)** | **React Native (Expo)** | `apps/mobile` | `8083` |
| **Database** | PostgreSQL 15 | Docker | `5432` |
| **Cache** | Redis 7 | Docker | `6379` |

### Key Features
*   **Multi-Tenancy:** Data isolation via `tenantId`.
*   **RBAC:** Role-Based Access Control (Admin, Manager, User).
*   **Strict Typing:** Shared DTOs and Logic.
*   **DevOps:** Docker Orchestration & Nginx Reverse Proxy.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** v18 or later.
*   **Docker Desktop** (for Database & Redis).
*   **Git**

### 1. Installation
Clone the repository and install dependencies from the root:
```bash
git clone <repo-url>
cd n-tier-architecture
npm install
```

### 2. Start Infrastructure
Launch PostgreSQL and Redis using Docker:
```bash
# Start DB and Cache in background
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Database Setup
Apply the database schema (Prisma Migrations):
```bash
# Run this from the root
npx prisma migrate dev --name init --schema=apps/api/prisma/schema.prisma
```
*Note: We point explicitly to the schema file location.*

### 4. Run Development Environment
Start **API, Web, and Mobile** simultaneously:
```bash
npm run dev
```
> This command uses TurboRepo to launch all apps in parallel.

*   **API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
*   **Web Dashboard:** [http://localhost:3001](http://localhost:3001)
    *   **Admin:** `admin@example.com` / `password123`
    *   **Manager:** `manager@example.com` / `password123`
*   **Mobile App:** Scan the QR code in your terminal with the **Expo Go** app (Android/iOS).

### Database Seeding
To reset and seed the database with default users:
```bash
cd apps/api
npx prisma db seed
```

---

### Packages Directory
The `packages/` directory is reserved for **Shared Libraries** to be used across apps in the future:
*   `packages/types` (Planned): Shared TypeScript interfaces & DTOs.
*   `packages/ui` (Planned): Shared UI components.
*   `packages/config` (Planned): Shared ESLint/TSConfig settings.

---

## 🛠 Troubleshooting

### "Port already in use"
If `npm run dev` fails because a port is taken:
```bash
# Windows (PowerShell) - Force kill processes
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

### "Prisma Client not initialized"
If the API fails with this error, regenerate the client:
```bash
cd apps/api
npx prisma generate
```

### "System Freeze on Web Dashboard"
Ensure `apps/web/src/context/auth-context.tsx` properly decodes the token. The repo includes a fix that uses `jwt-decode` to restore the user session on page load.

---

## 📦 Deployment

### Production Build (Docker)
To simulate a real production environment with Nginx:
```bash
docker-compose -f docker-compose.prod.yml up --build
```
Access the app at **http://localhost** (Port 80).

### CI/CD
GitHub Actions are configured in `.github/workflows/ci.yml` to automatically Lint, Build, and Test on every push to `main`.

### "Docker Volume Permissions" (Windows)
If Postgres fails to start due to permission errors on the `postgres_data` volume:
1.  Stop the containers: `docker-compose down`
2.  Prune volumes: `docker volume prune -f`
3.  Restart: `docker-compose -f docker-compose.dev.yml up -d`
