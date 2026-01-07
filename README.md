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



