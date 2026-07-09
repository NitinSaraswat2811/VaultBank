# VaultBank

A full-stack digital banking platform built to simulate how modern banking systems securely manage accounts and process financial transactions.

Unlike a basic payment application, VaultBank focuses on the backend architecture behind banking systems, including ledger-based transaction processing, atomic transfers, authentication, and secure account management. The project is being developed incrementally, with both the backend and frontend evolving together.

## Current Features

### Backend

* User Registration & Authentication
* JWT-based Authentication
* Secure Logout with Cookie Blacklisting
* Multi-Account Management
* Atomic Money Transfers
* Ledger-Based Transaction Recording
* Idempotent Transaction Protection
* Account Balance Calculation using MongoDB Aggregation Pipelines
* Transaction History APIs

### Frontend (In Progress)

* User Authentication
* Dashboard
* Account Balance
* Money Transfer
* Transaction History

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### Frontend

* React
* Vite
* Axios
* Tailwind CSS *(Planned)*

## Project Structure

```text
VaultBank/
│
├── backend/
│
├── frontend/
│
└── README.md
```

## Project Goal

The objective of VaultBank is to understand and implement the core concepts used in real banking systems, including secure authentication, transaction consistency, ledger-based accounting, scalable API design, and modern full-stack application architecture.

This project is being developed as a long-term portfolio project with a focus on clean architecture, maintainability, and real-world software engineering practices.

## Roadmap

* [x] Core Banking Engine
* [x] Authentication System
* [x] Ledger-Based Transactions
* [x] Transaction APIs
* [ ] React Frontend
* [ ] Dashboard
* [ ] Beneficiary Verification
* [ ] Spending Analytics
* [ ] Notifications
* [ ] Admin Panel

## Author

**Nitin Saraswat**
