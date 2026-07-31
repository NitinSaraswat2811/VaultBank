# VaultBank

VaultBank is a full-stack digital banking platform designed to simulate the core systems behind modern banking applications.

Unlike a basic payment application, VaultBank focuses on the backend architecture and engineering principles used in real-world financial systems, including secure authentication, multi-account management, atomic money transfers, ledger-based accounting, transaction consistency, and idempotent transaction processing.

The project was built incrementally with a strong focus on understanding how reliable banking systems manage money and maintain data consistency.

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Protected API routes using authentication middleware
* Secure logout with token blacklisting
* Password hashing using bcrypt
* Token persistence using secure client-side authentication flow

### 🏦 Account Management

* Create and manage multiple bank accounts
* Unique account number generation
* Account ownership validation
* Account status management
* Support for account states such as:

  * Active
  * Frozen
  * Closed
* Account holder identity verification

### 💸 Money Transfers

* Transfer money between bank accounts
* Sender and receiver account validation
* Receiver name verification before transfer
* Balance validation before processing transactions
* Prevention of self-transfers
* Transaction status management:

  * Completed
  * Pending
  * Failed
  * Reversed

### 📒 Ledger-Based Accounting

VaultBank does not simply update an account balance directly after every transaction.

Instead, transactions are recorded through a ledger-based system. Account balances are calculated from ledger entries, providing a more reliable and auditable approach to financial data management.

This approach helps maintain:

* Transaction traceability
* Accurate balance calculation
* Financial auditability
* Consistent transaction records

### ⚛️ Atomic Transactions

Money transfers are processed atomically to ensure that a transaction either completes fully or fails without leaving the system in an inconsistent state.

The transfer process ensures that:

1. The sender has sufficient balance.
2. The transaction is validated.
3. The ledger entries are created.
4. The transaction is committed successfully.

If any step fails, the transaction is rolled back.

### 🔁 Idempotent Transactions

VaultBank implements idempotency protection for financial transactions.

This prevents duplicate transfers when:

* A user accidentally clicks the transfer button multiple times.
* A network request times out.
* The client retries a request after not receiving a response.

The same idempotency key can be used to safely identify and prevent duplicate transaction processing.

### 📊 Dashboard

The banking dashboard provides:

* Account overview
* Available balance
* Primary account information
* Recent transaction activity
* Transaction history
* Account management options

### 📜 Transaction History

Users can view transaction history associated with their bank accounts, including:

* Debit transactions
* Credit transactions
* Transaction amounts
* Transaction status
* Transaction timestamps

## 🛠 Tech Stack

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
* React Router
* Axios
* Tailwind CSS
* Lucide React

## ⚙️ Installation & Setup

### Prerequisites

Before running VaultBank locally, make sure you have:

* Node.js (v18 or later recommended)
* npm
* A MongoDB Atlas cluster, or
* A local MongoDB instance configured as a **replica set**

> **Important:** VaultBank uses MongoDB multi-document transactions for atomic money transfers. MongoDB transactions require a replica set or sharded cluster and do not work on a standalone MongoDB instance.

### 1. Clone the Repository

```bash
git clone https://github.com/NitinSaraswat2811/VaultBank.git
cd VaultBank
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SYSTEM_ACCOUNT_NUMBER=your_system_account_number
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the backend API through the configured API connection.

### Environment Variables

| Variable                | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `MONGO_URL`             | MongoDB connection string                           |
| `JWT_SECRET`            | Secret used to sign and verify JWT tokens           |
| `SYSTEM_ACCOUNT_NUMBER` | System account used for internal banking operations |


## 🏗️ Architecture

VaultBank follows a full-stack client-server architecture.

```text
                 ┌────────────────────┐
                 │   React Frontend    │
                 │  Dashboard / UI     │
                 └─────────┬──────────┘
                           │
                           │ REST API
                           │
                 ┌─────────▼──────────┐
                 │   Express Backend  │
                 │  Auth / Accounts   │
                 │  Transactions      │
                 └─────────┬──────────┘
                           │
                 ┌─────────▼──────────┐
                 │      MongoDB        │
                 │                    │
                 │ Users               │
                 │ Accounts            │
                 │ Transactions        │
                 │ Ledger Entries      │
                 └────────────────────┘
```

## 💡 How a Money Transfer Works

1. The user selects a sender account.
2. The receiver account is validated.
3. Receiver identity is verified.
4. The system checks the sender's available balance.
5. The transaction request is validated.
6. Idempotency protection checks for duplicate requests.
7. The transfer is processed atomically.
8. Corresponding ledger entries are recorded.
9. The transaction status is updated.
10. The updated balance and transaction history become available to the user.

## 📡 API Modules

The backend is organized around multiple core modules:

### Authentication

* User registration
* User login
* Secure logout
* Protected routes

### Accounts

* Create bank account
* Retrieve user accounts
* Account validation
* Account status management

### Transactions

* Initiate money transfers
* Validate sender and receiver accounts
* Process atomic transactions
* Prevent duplicate transactions
* Track transaction status

### Ledger

* Record debit entries
* Record credit entries
* Calculate account balances
* Maintain transaction history

## 📁 Project Structure

```text
VaultBank/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
└── README.md
```

## 🎯 Project Objective

The primary objective of VaultBank was to understand and implement the engineering concepts behind reliable financial systems.

The project focuses on:

* Authentication and authorization
* Multi-account banking systems
* Atomic database operations
* Ledger-based accounting
* Transaction consistency
* Idempotent API design
* Balance calculation
* Secure account management
* Full-stack application architecture

Rather than building only a simple payment interface, VaultBank was developed to explore the backend logic and system design principles that make financial applications reliable.

## 🚀 Project Status

VaultBank is currently a completed full-stack banking application.

The project was developed incrementally, with the backend banking engine and React frontend evolving together.

## 🔮 Future Improvements

Potential future improvements include:

* [ ] Spending analytics
* [ ] Notifications
* [ ] Beneficiary management
* [ ] Scheduled transfers
* [ ] Recurring payments
* [ ] Admin dashboard
* [ ] Fraud detection mechanisms
* [ ] Rate limiting
* [ ] Email notifications
* [ ] Two-factor authentication
* [ ] Enhanced transaction search and filtering

## 🎥 Demo

Watch the complete VaultBank walkthrough here:

▶️ **LinkedIn Demo**
https://www.linkedin.com/feed/update/urn:li:activity:7487916269434781697/

🌐 **Live Application**
https://vaultbank-two.vercel.app

## 🔗 Repository

GitHub: https://github.com/NitinSaraswat2811/VaultBank

## 👨‍💻 Author

**Nitin Saraswat**

GitHub: https://github.com/NitinSaraswat2811

---

Built to understand how modern banking systems manage accounts, transactions, and financial data consistency.
