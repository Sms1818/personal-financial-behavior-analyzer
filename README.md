# Personal Financial Behavior Analyzer (PFBA)

PFBA is a **backend-centric financial system** designed to analyze personal spending behavior and generate **actionable, explainable insights** using asynchronous processing and clean system design.

In addition to the CRUD operations, PFBA emphasizes **data integrity, lifecycle management, concurrency, and behavior analysis**, making it closer to a real-world financial backend service.

---

## Overview

Personal Financial Behavior Analyzer (PFBA) goes beyond simple expense storage.  
It models the **full lifecycle of expenses**, supports **bulk ingestion**, **recurring transactions**, and **versioned data**, and performs **asynchronous analysis** to uncover spending patterns, trends, and anomalies.

The system cleanly separates:
- Expense ingestion and lifecycle management
- Background analysis and insight generation
- Recommendation and explanation layers

This separation ensures scalability, responsiveness, and long-term maintainability.

---

## Core Capabilities (Planned & In Progress)

### Expense Management
- Full CRUD operations with validation
- Soft delete and expense lifecycle states
- Versioned expenses (audit trail)
- Multi-tag support for flexible categorization
- Source attribution (manual, CSV, recurring)

### Ingestion & Automation
- Bulk expense upload via CSV
- Row-level validation and partial success reporting
- Thread-safe batch processing
- Recurring expense scheduling with idempotent execution

### Analysis & Insights
- Category-wise and tag-based spending analysis
- Monthly and trend-based summaries
- Overspending and anomaly detection
- Scheduled background analysis jobs
- Insight history and evolution tracking

### AI-Enhanced Recommendations
- LLM-based recommendation layer built on structured insights
- Rule-driven analysis with AI-generated explanations
- Asynchronous execution with privacy-aware design
- Feature-flag controlled and replaceable AI integration

---

## High-Level Architecture

Client  
→ REST API (Controller Layer)  
→ Service Layer  
→ Analysis & Insight Engine  
→ Asynchronous Processing (Custom Thread Pools)  
→ Repository Layer  

Expense ingestion is optimized for write-heavy workloads, while analysis and recommendations are executed asynchronously to avoid blocking API requests and to support scalable background processing.

---

## Tech Stack

- Java 17  
- Spring Boot 3  
- Maven  
- Java Concurrency (`ExecutorService`, `CompletableFuture`)  
- In-memory thread-safe storage (initial phase)  

**Planned:**
- PostgreSQL  
- Docker  
- Kubernetes  
- LLM API integration  

---

## Design Principles

- Clean separation of responsibilities
- Immutable domain models where appropriate
- Thread safety by design
- Asynchronous processing for expensive computations
- Extensible architecture using well-known design patterns:
  - Strategy
  - Factory
  - Builder
  - Observer (event-style orchestration)
  - Repository

---

## Development Approach

PFBA is developed incrementally with a strong focus on:
- Applying core Java and OOP concepts in real scenarios
- Writing production-quality, maintainable code
- Understanding system design trade-offs
- Demonstrating concurrency, async processing, and clean architecture
- Building features intentionally rather than artificially
- CSV bulk imports are processed asynchronously using a dedicated executor to ensure that API threads remain non-blocking and scalable under large uploads.



---


## Progress

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
-**Day 11:** Added LLM-based insight explanations with a pluggable LLMClient abstraction, mock support, and graceful fallback logic; attempted real LLM (OpenAI/Gemini) integration but deferred due to API/model compatibility issues
- **Day 12:** Fixed issues in insight generation where duplicate records were being created, improved the insight lifecycle (ACTIVE → RESOLVED), refined severity escalation logic, and stabilized the LLM-based explanation flow with proper error handling
- **Day 13:** Integrated PostgreSQL using Spring Data JPA, introduced clean repository abstractions to decouple domain logic from persistence, and successfully migrated expense storage from in-memory to database-backed implementation.
- **Day 14:** Migrated from in-memory storage to PostgreSQL,reinforced async processing boundaries, and stabilized scheduled insight generation with proper lifecycle transitions
- **Day 15:** Integrated PostgreSQL with clean environment-based switching (in-memory for dev, JPA for prod), resolved repository and profile clashes to stabilize the backend for long-term use, and successfully validated production startup. Bootstrapped a React + Vite frontend with a clean structure and completed the first end-to-end integration by fetching and rendering expenses from backend APIs.
- **Day 16:** Implemented React-based frontend pages to display Expenses and Insights, integrating them with backend APIs (/api/expenses and /api/insights), setting up client-side routing using React Router for /expenses and /insights, and establishing a clean, scalable frontend structure with dedicated pages and service layers for API communication.
- **Day 17:** The Expense Management frontend was extended beyond read-only views by adding an inline Add/Edit Expense modal within the Expense List page.
The frontend was connected to backend create and update APIs with reusable form logic and automatic list refresh after successful actions.
- **Day 18:** Added real-time summaries including total spend, top category, recent expense, and animated category-wise breakdown bars.Improved UX with inline add/edit/delete expense modal and automatic list refresh.
- **Day 19:** Enhanced the Expense page with advanced filtering, sorting, and search capabilities including date-range filters.Improved UI/UX with a dark-themed dashboard, sticky insights panel, category-wise breakdown, and smart spending insights.
- **Day 20:** Implemented a dedicated Insights page with severity-based grouping, status filtering (Active, Acknowledged, Resolved, Dismissed), and overview statistics.
- **Day 21:** Enhanced UI with interactive charts (line, bar, pie) for deeper expense insights.Improved expense and insight pages with better visual hierarchy and data clarity.Added CSV upload UI to support bulk expense imports alongside manual entry.