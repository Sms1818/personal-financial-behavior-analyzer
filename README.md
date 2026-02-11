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

- **Day 1:** Project setup, domain modeling, thread-safe repository  

- **Day 2:** Service layer, dependency injection, type safety improvements, domain identity  

- **Day 3:** REST controllers, expense APIs, and DTO-based request handling  

- **Day 4:** API validation, global exception handling, async spending analysis with custom thread pool  

- **Day 5:** Completed full CRUD operations with immutable updates, soft delete using lifecycle states, and proper HTTP error semantics  

- **Day 6:** Implemented immutable expense versioning with full audit trail, history APIs  

- **Day 7:** Bulk CSV expense import with validation, partial failure handling, and asynchronous background processing  

- **Day 8:** Introduced import audit system with lifecycle tracking, audit status APIs, and job observability for asynchronous data ingestion  

- **Day 9:** Added intelligent insight foundation with domain modeling, persisted insights, rule-based total spending analysis, and read-only insight APIs  

- **Day 10:** Asynchronous insight generation with idempotency, lifecycle awareness, and severity escalation (LOW → MEDIUM → HIGH)  

- **Day 11:** Added LLM-based insight explanations with a pluggable LLMClient abstraction, mock support, and graceful fallback logic; attempted real LLM (OpenAI/Gemini) integration but deferred due to API/model compatibility issues  

- **Day 12:** Fixed issues in insight generation where duplicate records were being created, improved the insight lifecycle (ACTIVE → RESOLVED), refined severity escalation logic, and stabilized the LLM-based explanation flow with proper error handling  

- **Day 13:** Integrated PostgreSQL using Spring Data JPA, introduced clean repository abstractions to decouple domain logic from persistence, and successfully migrated expense storage from in-memory to database-backed implementation  

- **Day 14:** Migrated from in-memory storage to PostgreSQL, reinforced async processing boundaries, and stabilized scheduled insight generation with proper lifecycle transitions  

- **Day 15:** Integrated PostgreSQL with clean environment-based switching (in-memory for dev, JPA for prod), resolved repository and profile clashes to stabilize the backend for long-term use, and validated production startup. Bootstrapped a React + Vite frontend and completed the first end-to-end integration  

- **Day 16:** Implemented React-based frontend pages to display Expenses and Insights, integrating them with backend APIs (/api/expenses and /api/insights), setting up client-side routing using React Router for /expenses and /insights, and establishing a clean, scalable frontend structure with dedicated pages and service layers for API communication. 

- **Day 17:** The Expense Management frontend was extended beyond read-only views by adding an inline Add/Edit Expense modal within the Expense List page. The frontend was connected to backend create and update APIs with reusable form logic and automatic list refresh after successful actions. 

- **Day 18:** Added real-time summaries including total spend, top category, recent expense, and animated category-wise breakdown bars.Improved UX with inline add/edit/delete expense modal and automatic list refresh. 

- **Day 19:** Enhanced the Expense page with advanced filtering, sorting, and search capabilities including date-range filters.Improved UI/UX with a dark-themed dashboard, sticky insights panel, category-wise breakdown, and smart spending insights. 

- **Day 20:** Implemented a dedicated Insights page with severity-based grouping, status filtering (Active, Acknowledged, Resolved, Dismissed), and overview statistics. 

- **Day 21:** Enhanced UI with interactive charts (line, bar, pie) for deeper expense insights.Improved expense and insight pages with better visual hierarchy and data clarity.Added CSV upload UI to support bulk expense imports alongside manual entry. 

- **Day 22:** Added full income–expense support with proper debit/credit handling, accurate net balance calculation, and CSV import enhancements. Improved dashboard analytics, charts, and summaries to ensure clean financial reporting and production-ready data consistency. 

- **Day 23:** Added interactive financial graphs including Net Cash Flow and Savings Rate to visualize spending behavior over time.LLM-powered explanations and recommendations are currently in progress and will be completed next. 

- **Day 24:** Fixed Gemini LLM integration by aligning request/response schema and improving JSON parsing stability. 

- **Day 25:** Removed rule-based insight engine and fully transitioned to LLM-driven insight generation.Implemented expense summary–based AI insight creation with clean backend flow. 

- **Day 26:** Migrated from single insight to multi-insight AI generation.Added AI-driven severity classification and resolved enum parsing failures. 

- **Day 27:** Implemented core authentication foundation using Spring Security.Added User entity, repository, password hashing (BCrypt), and public auth route for registration of user. 

- **Day 28:** Implemented JWT-based authentication for secure token generation. Added backend login flow with password validation and role-based claims. Integrated authentication service layer using Spring Security and BCrypt. 

- **Day 29:** Built and integrated frontend flows for user login and registration. Connected expenses and AI insights to the authenticated user context. CSV expense import is partially implemented but still not persisting data correctly and needs further debugging and resolution. 

- **Day 30:** Fixed CSV expense upload to correctly persist records for the authenticated user. 

- **Day 31:** Added observability with Actuator, Micrometer, Prometheus, and Grafana. Exposed JVM and domain-level metrics. Verified end-to-end metrics flow from the application to Prometheus and visualized key system and business KPIs in Grafana. Additionally, dockerized the full application stack (backend, frontend, PostgreSQL, Prometheus, and Grafana) using multi-stage Docker builds and Docker Compose, preparing the system for containerized and cloud-native deployment.

- **Day 32:** Initiated Kubernetes deployment for backend and database. Added Deployments and Services with multi-replica pods and debugged real-world issues such as service discovery, pod restarts, and startup dependency timing. 

- **Day 33:** Simplified cluster networking by replacing Ingress with NodePort services, enabling direct local access to frontend and backend.

- **Day 34:** Deployed full observability stack on Kubernetes with Prometheus and Grafana services, verified metrics scraping, dashboards, and end-to-end monitoring. Finalized Docker images, stabilized the cluster, and completed production-ready setup.
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
