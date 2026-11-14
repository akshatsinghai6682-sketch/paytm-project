# PayTM Digital Wallet 💳

A full-stack fintech digital wallet application built with **Next.js 14**, **Turborepo**, **PostgreSQL**, **Prisma ORM**, and **Express**. Features real-time peer-to-peer (P2P) money transfers with deterministic concurrency locking, simulated bank on-ramp deposits via webhooks, and a responsive financial dashboard.

---

## 🌟 Key Features

- **🔐 Secure Authentication**: Custom NextAuth credentials provider with bcrypt password hashing and JWT session management. Automatic zero-balance account initialization for new users.
- **⚡ Atomic P2P Transfers**: Real-time transfers between phone numbers wrapped in database transactions with **deterministic ID ordering** (`FOR UPDATE`) to eliminate race conditions and database deadlocks.
- **🏦 Bank On-Ramp Webhooks**: Express-based webhook microservice that processes on-ramp payments idempotently with balance upsert protection and secret verification.
- **📊 Financial Dashboard**: Real-time wallet balance, quick actions (Add Money, Send Money), recent activity timeline with directional status pills, and transaction filters with CSV export.
- **📱 Fully Responsive Design**: Paytm-branded theme with modern glassmorphism balance cards, desktop sidebar, and native-feeling mobile tab navigation.
- **🏗️ Modern Turborepo Monorepo**: Shared database client (`@repo/db`), reusable component library (`@repo/ui`), and state management (`@repo/store`).

---

## 🏗️ Architecture

```mermaid
graph TD
    User([End User]) -->|Browser / Mobile| UserApp[Next.js User App :3001]
    UserApp -->|Read / Write| DB[(PostgreSQL)]
    UserApp -->|Initiate On-Ramp| Webhook[Bank Webhook Service :3003]
    Webhook -->|Idempotent Credit| DB
    Merchant([Merchant]) -->|Dashboard| MerchantApp[Next.js Merchant App :3000]
    MerchantApp -->|Analytics| DB
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | Turborepo, npm workspaces |
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Sonner |
| **Backend & Webhooks** | Next.js Server Actions, Express.js, Node.js `crypto` |
| **Database & ORM** | PostgreSQL, Prisma ORM with connection pooling & composite indexes |
| **Authentication** | NextAuth.js, bcrypt, JWT |
| **State & Store** | Recoil |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (for local PostgreSQL) or a cloud PostgreSQL database (e.g. Neon, Supabase)

### 2. Clone the Repository
```bash
git clone https://github.com/akshatsinghai6682-sketch/week-17-final-code.git
cd week-17-final-code
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Start a local PostgreSQL database with Docker:
```bash
docker run --name paytm-db -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

Create a `.env` file in `packages/db/.env`:
```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

Run migrations and seed default demo accounts:
```bash
cd packages/db
npx prisma migrate dev
npx prisma db seed
cd ../..
```

*Demo Accounts Seeded:*
- **Alice**: Phone `1111111111` | Password `alice` (Starting balance: ₹200)
- **Bob**: Phone `2222222222` | Password `bob` (Starting balance: ₹20)

### 5. Run the Application
Start all microservices concurrently via Turborepo:
```bash
npm run dev
```

- **User Application**: [http://localhost:3001](http://localhost:3001)
- **Merchant Portal**: [http://localhost:3000](http://localhost:3000)
- **Bank Webhook Service**: [http://localhost:3003](http://localhost:3003)

---

## 🛡️ Concurrency & Security Engineering

- **Deadlock-Free P2P Transfers**: When users simultaneously send funds to one another, acquiring locks in non-deterministic order results in cyclic graph wait states (`40P01`). The transfer pipeline sorts participant user IDs before locking rows deterministically:
  ```typescript
  const [firstId, secondId] = [fromId, toId].sort((a, b) => a - b);
  await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" IN (${firstId}, ${secondId}) ORDER BY "userId" FOR UPDATE`;
  ```
- **Idempotency Protection**: Webhook token requests verify transaction state (`Processing` vs `Success`/`Failure`) ensuring duplicate webhook retries cannot credit balances multiple times.
- **Cryptographic Tokens**: On-ramp authorization tokens utilize `crypto.randomUUID()` to prevent token guessing and collisions.