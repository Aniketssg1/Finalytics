# 💰 Finalytics — FutureBank Net-Banking Platform

A full-stack **net-banking web application** built with a microservices backend (Spring Boot) and a modern React frontend. Finalytics provides a complete digital banking experience — from account management and fund transfers to smart spend analytics with interactive charts.

---

## ✨ Features

| Area | Highlights |
| --- | --- |
| **Authentication** | User registration, JWT-based login, OTP verification, role-based access |
| **Dashboard** | Personalized home page with quick links, announcements & personalized offers |
| **Accounts** | Savings, Current, Fixed Deposit, Recurring Deposit & Loan account views |
| **Fund Transfers** | Within-bank transfers, other-bank transfers, quick transfers, scheduled transfers |
| **Payments** | Bill payments and payment management |
| **Spend Analyzer** | Category-wise expenditure breakdown with interactive Chart.js / Recharts visuals |
| **Profile** | View & update personal details, change password |
| **Support** | In-app customer support module |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                      │
│               (localhost:3000 — net_spend)               │
└──────────────┬──────────────────────┬───────────────────┘
               │  REST / JSON + JWT   │
       ┌───────▼────────┐    ┌────────▼───────────┐
       │  Auth Service   │───▶│  Account Service   │
       │  (port 8082)    │    │   (port 8083)      │
       └───────┬─────────┘    └────────┬───────────┘
               │                       │
       ┌───────▼─────────┐    ┌────────▼───────────┐
       │ AuthServiceDB    │   │ AccountServiceDB    │
       │   (MySQL)        │   │   (MySQL)           │
       └──────────────────┘   └────────────────────┘
```

| Service | Port | Database | Purpose |
| --- | --- | --- | --- |
| **AuthenticationService** | `8082` | `AuthServiceDB0001` | User registration, login, JWT, beneficiary management |
| **AccountService** | `8083` | `AccountServiceDB0002` | Accounts, transactions, expenditure tracking, spend analysis |
| **Frontend (net_spend)** | `3000` | — | React SPA serving the UI |

---

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 2.7.18**
- Spring Security + **JWT** (jjwt 0.11.5)
- Spring Data JPA / Hibernate (MySQL 8 dialect)
- Spring WebFlux (inter-service communication)
- Swagger / OpenAPI (springdoc 1.7.0)
- Lombok, ModelMapper, Bean Validation
- Maven wrapper (`mvnw`)

### Frontend
- **React 18** (Create React App)
- **Redux Toolkit** + React-Redux for state management
- **React Router v6** for client-side routing
- **Bootstrap 5** + Reactstrap for responsive UI
- **Chart.js** (react-chartjs-2) & **Recharts** for data visualisation
- **Axios** for HTTP calls
- React Icons

### Database
- **MySQL 8** (auto-creates databases on first run)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
| --- | --- |
| JDK | 17+ |
| Maven | 3.8+ (or use included `mvnw`) |
| Node.js | 16+ |
| npm | 8+ |
| MySQL | 8.0+ |

### 1. Clone the repository

```bash
git clone <repository-url>
cd Finalytics
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Key variables:

```env
DB_URL=jdbc:mysql://localhost:3306/AccountServiceDB0002?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_secure_db_password
JWT_SECRET=your-production-secret-key-at-least-64-characters-long
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:3000
ACCOUNT_SERVICE_URL=http://localhost:8083
```

> **Note:** The databases (`AuthServiceDB0001` and `AccountServiceDB0002`) are auto-created by Hibernate on first startup — just ensure MySQL is running.

### 3. Start the Backend Services

**Account Service (port 8083)**

```bash
cd BackEnd/AccountServiceFinal
./mvnw spring-boot:run
```

**Authentication Service (port 8082)**

```bash
cd BackEnd/AuthenticationService
./mvnw spring-boot:run
```

### 4. Start the Frontend (port 3000)

```bash
cd FrontEnd/net_spend
npm install
npm start
```

The application will open at **http://localhost:3000**.

---

## 📁 Project Structure

```
Finalytics/
├── .env.example                       # Environment variable template
├── BackEnd/
│   ├── AccountServiceFinal/           # Account & transaction microservice
│   │   └── src/main/java/com/futurebank/accountService/
│   │       ├── controller/            # REST controllers
│   │       │   ├── AccountController
│   │       │   ├── TransactionController
│   │       │   ├── ExpenditureController
│   │       │   └── SpendAnalyzerController
│   │       ├── model/                 # JPA entities
│   │       ├── repository/            # Spring Data repositories
│   │       ├── service/               # Business logic
│   │       ├── config/                # Security, CORS, app config
│   │       ├── exception/             # Custom exception handlers
│   │       └── DTO/                   # Data transfer objects
│   │
│   └── AuthenticationService/         # Auth & user management microservice
│       └── src/main/java/com/futurebank/authservice/
│           ├── controller/            # Auth & beneficiary endpoints
│           ├── model/                 # User, Role, Beneficiary entities
│           ├── repository/            # User & beneficiary repos
│           ├── service/               # User & beneficiary services
│           ├── security/              # JWT filter, token provider
│           ├── config/                # Security, CORS config
│           ├── client/                # Account service client
│           ├── dto/                   # Registration, login DTOs
│           └── exception/             # Exception handlers
│
└── FrontEnd/
    └── net_spend/                     # React SPA
        └── src/
            ├── components/
            │   ├── Auth/              # Login, Register, OTP
            │   ├── Dashboard/         # Dashboard, SpendAnalyzer
            │   ├── Accounts/          # Account type views
            │   ├── FundTransfer/      # Transfer flows
            │   ├── Payments/          # Bill payments
            │   ├── Profile/           # User profile management
            │   ├── Support/           # Customer support
            │   ├── HomePage/          # Landing, offers, announcements
            │   ├── Logout/            # Session logout
            │   └── common/            # Shared / reusable components
            ├── Services/              # API service modules (Axios)
            ├── Hooks/                 # Custom React hooks
            ├── Utils/                 # Formatting & validation helpers
            └── store.js               # Redux store configuration
```

---

## 📖 API Documentation

Swagger UI is available once the services are running:

| Service | Swagger URL |
| --- | --- |
| Account Service | http://localhost:8083/swagger-ui/index.html |
| Auth Service | http://localhost:8082/swagger-ui/index.html |

---

## 🔑 Default Ports

| Component | Port |
| --- | --- |
| Frontend (React) | `3000` |
| Authentication Service | `8082` |
| Account Service | `8083` |
| MySQL | `3306` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational / demonstration purposes.
