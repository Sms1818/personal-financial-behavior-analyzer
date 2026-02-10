# 💰 Personal Financial Behavior Analyzer (PFBA)

Personal Financial Behavior Analyzer (PFBA) is a **backend-centric financial system** designed to analyze personal spending behavior and generate **actionable, explainable insights** using asynchronous processing and clean system design.

Unlike simple expense trackers, PFBA models the **complete financial data lifecycle**, supports **bulk ingestion**, **recurring transactions**, **versioned records**, and runs **background behavioral analysis** to detect patterns, trends, and anomalies — closely resembling a real-world production financial backend service.

The system prioritizes:

- Data integrity  
- Concurrency safety  
- Lifecycle-aware domain modeling  
- Asynchronous processing  
- Explainable AI insights  
- Observability and cloud-native deployment  

---

# 📌 Overview

PFBA goes beyond storing expenses.

It cleanly separates:

- Expense ingestion and lifecycle management  
- Background analysis and insight generation  
- Recommendation and explanation layers  

This separation ensures:

- Scalability  
- Responsiveness  
- Maintainability  
- Production readiness  

---

# 🚀 Core Capabilities

## 💸 Expense Management
- Full CRUD operations with validation  
- Soft delete with lifecycle states  
- Immutable versioned expenses (audit trail)  
- Multi-tag categorization  
- Source attribution (manual, CSV, recurring)

## ⚙️ Ingestion & Automation
- Bulk CSV expense upload  
- Row-level validation with partial success reporting  
- Thread-safe batch processing  
- Recurring expense scheduling with idempotent execution

## 📊 Analysis & Insights
- Category-wise and tag-based analysis  
- Monthly and trend summaries  
- Overspending detection  
- Anomaly detection  
- Scheduled background insight jobs  
- Insight history tracking

## 🤖 AI-Enhanced Recommendations
- LLM-based insight generation  
- Structured financial summaries  
- AI-driven severity classification  
- Human-readable explanations  
- Pluggable AI integration  
- Privacy-aware async processing

## 🔐 Security
- Spring Security  
- JWT authentication  
- BCrypt password hashing  
- User-scoped financial data

## 📈 Observability
- Actuator  
- Micrometer  
- Prometheus  
- Grafana dashboards  
- JVM + business metrics

---

# 🏗️ High-Level Architecture

```
Frontend (React)
        ↓
Spring Boot REST API
        ↓
Service Layer
        ↓
Analysis & Insight Engine
        ↓
PostgreSQL
```

### Infrastructure

```
Docker → Kubernetes → Prometheus → Grafana
```

---

# 🛠️ Tech Stack

## Backend
- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven
- CompletableFuture / ExecutorService

## Frontend
- React
- Vite

## DevOps / Infra
- Docker
- Kubernetes
- Prometheus
- Grafana

---

# 📆 Project Progress

**Day 1:** Project setup, domain modeling, thread-safe repository  

**Day 2:** Service layer, dependency injection, type safety improvements, domain identity  

**Day 3:** REST controllers, expense APIs, and DTO-based request handling  

**Day 4:** API validation, global exception handling, async spending analysis with custom thread pool  

**Day 5:** Completed full CRUD operations with immutable updates, soft delete using lifecycle states, and proper HTTP error semantics  

**Day 6:** Implemented immutable expense versioning with full audit trail, history APIs  

**Day 7:** Bulk CSV expense import with validation, partial failure handling, and asynchronous background processing  

**Day 8:** Introduced import audit system with lifecycle tracking, audit status APIs, and job observability for asynchronous data ingestion  

**Day 9:** Added intelligent insight foundation with domain modeling, persisted insights, rule-based total spending analysis, and read-only insight APIs  

**Day 10:** Asynchronous insight generation with idempotency, lifecycle awareness, and severity escalation (LOW → MEDIUM → HIGH)  

**Day 11:** Added LLM-based insight explanations with a pluggable LLMClient abstraction, mock support, and graceful fallback logic; attempted real LLM (OpenAI/Gemini) integration but deferred due to API/model compatibility issues  

**Day 12:** Fixed issues in insight generation where duplicate records were being created, improved the insight lifecycle (ACTIVE → RESOLVED), refined severity escalation logic, and stabilized the LLM-based explanation flow with proper error handling  

**Day 13:** Integrated PostgreSQL using Spring Data JPA, introduced clean repository abstractions to decouple domain logic from persistence, and successfully migrated expense storage from in-memory to database-backed implementation  

**Day 14:** Migrated from in-memory storage to PostgreSQL, reinforced async processing boundaries, and stabilized scheduled insight generation with proper lifecycle transitions  

**Day 15:** Integrated PostgreSQL with clean environment-based switching (in-memory for dev, JPA for prod), resolved repository and profile clashes to stabilize the backend for long-term use, and validated production startup. Bootstrapped a React + Vite frontend and completed the first end-to-end integration  

**Day 16:** Implemented React-based frontend pages to display Expenses and Insights with client-side routing  

**Day 17:** Added inline Add/Edit Expense modal with backend integration  

**Day 18:** Added real-time summaries and animated category breakdown  

**Day 19:** Implemented filtering, sorting, search, and dark-themed dashboard  

**Day 20:** Dedicated Insights page with severity grouping and lifecycle filters  

**Day 21:** Interactive charts and CSV upload UI  

**Day 22:** Full income–expense support with accurate net balance calculation  

**Day 23:** Net Cash Flow and Savings Rate graphs  

**Day 24:** Fixed Gemini LLM integration  

**Day 25:** Fully transitioned from rule engine to LLM-driven insights  

**Day 26:** Multi-insight AI generation with severity classification  

**Day 27:** Spring Security authentication foundation  

**Day 28:** JWT login and role-based claims  

**Day 29:** Frontend login/register flows integrated  

**Day 30:** Fixed CSV upload persistence  

**Day 31:** Observability stack with Prometheus & Grafana  

**Day 32:** Kubernetes deployments and services  

**Day 33:** NodePort networking  

**Day 34:** Full production-style cluster with monitoring and stable end-to-end flow  

---

# ▶️ How to Run the Project

## Prerequisites
- Docker  
- Kubernetes (Docker Desktop or Minikube)  
- kubectl  
- Java 17+  
- Maven  
- Node.js  

---

# ✅ Option 1 — Kubernetes (Recommended)

### Build Images
```bash
docker build -t personal-financial-behavior-analyzer-backend:latest .
docker build -t personal-financial-behavior-analyzer-frontend:latest ./pfba-frontend
```

### Deploy
```bash
kubectl apply -f k8s/postgres
kubectl apply -f k8s/backend
kubectl apply -f k8s/frontend
kubectl apply -f k8s/monitoring
```

### Access
| Service | URL |
|--------|-----|
| Frontend | http://localhost:30080 |
| Backend API | http://localhost:30081/api |
| Health | http://localhost:30081/actuator/health |
| Prometheus | http://localhost:30090 |
| Grafana | http://localhost:30300 |

---

# 🧪 Option 2 — Local Development

### Start PostgreSQL
```bash
docker run -d --name pfba-postgres \
-e POSTGRES_DB=pfba \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-p 5432:5432 postgres:16
```

### Backend
```bash
mvn spring-boot:run
```
http://localhost:8080

### Frontend
```bash
cd pfba-frontend
npm install
npm run dev
```
http://localhost:5173

---

# ⭐ Recommended Workflow

- Use **Kubernetes** for realistic full-stack testing  
- Use **Local mode** for faster development  

---

## ✅ Summary

PFBA demonstrates:

- Production-grade backend architecture  
- Async + concurrent processing  
- Clean domain modeling  
- AI-powered insights  
- Secure authentication  
- Observability-first design  
- Containerized + Kubernetes deployment  

This project mirrors how real financial backend systems are built and operated in production environments.
