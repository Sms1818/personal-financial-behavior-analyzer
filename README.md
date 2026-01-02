# Personal Financial Behavior Analyzer (PFBA)

A backend system that analyzes personal spending data to identify financial behavior patterns and generate actionable insights using asynchronous processing.

## Overview

Personal Financial Behavior Analyzer (PFBA) is a backend-focused system built to go beyond basic expense tracking.
Instead of simply storing expenses, the system analyzes spending data over time to detect patterns, anomalies, and trends that reflect real financial behavior.

The application separates expense ingestion from analysis logic. Computationally intensive analysis is executed asynchronously,
ensuring that API operations remain responsive while maintaining scalability and clean system design.

## Core Features (Planned)

- Expense ingestion with input validation
- Thread-safe expense storage
- Category-wise spending aggregation
- Monthly spending summaries
- Budget threshold detection
- Spending behavior analysis (overspending, anomalies, trends)
- Asynchronous insight generation
- Scheduled background analysis jobs
- Alert triggering based on generated insights

## High-Level Architecture

Client  
→ REST API (Controller Layer)  
→ Service Layer  
→ Analysis Engine  
→ Asynchronous Processing (Thread Pool)  
→ Repository Layer  

The system separates write-heavy expense ingestion from CPU-intensive analysis logic.
Analysis tasks are executed asynchronously using controlled thread pools to avoid blocking API requests
and to support scalable processing.

## Tech Stack

- Java 17
- Spring Boot 3
- Maven
- Java Concurrency (ExecutorService, CompletableFuture)
- In-memory thread-safe storage (initial phase)

**Planned:**
- PostgreSQL
- Docker
- Kubernetes

## Design Principles

- Clean separation of responsibilities
- Immutability where appropriate
- Thread safety by design
- Asynchronous processing for computationally intensive tasks
- Extensible analysis logic using well-known design patterns

## Development Approach

PFBA is developed incrementally with a focus on:
- Understanding technical trade-offs
- Applying core Java concepts in practical scenarios
- Writing readable and maintainable code
- Treating the system as production-ready from day one

## Project Status

In active development  
This project is being built incrementally with continuous improvements.

## Progress

- Day 1: Project setup, domain modeling, thread-safe repository
- Day 2: Service layer, dependency injection, type safety improvements, domain identity

