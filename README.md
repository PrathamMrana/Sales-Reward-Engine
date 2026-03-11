<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/rocket.svg" width="100" height="100" alt="Sales Reward Engine Logo">

  # Sales Reward Engine

  **An Enterprise-Grade Sales Performance & Incentive Management Platform**

  A modern, full-stack incentive tracking system for high-performing sales organizations.

  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Neon](https://img.shields.io/badge/Database-Neon.tech-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)

  <br />
</div>

---

## 🌐 Production Environment

🚀 **[Access Sales Reward Engine →](https://sales-reward-engine.vercel.app)**

| Component | Status | URL |
| :--- | :--- | :--- |
| 🖥️ **Frontend UI** | Online | [sales-reward-engine.vercel.app](https://sales-reward-engine.vercel.app) |
| ⚙️ **Backend API** | Online | [sales-incentive-backend.onrender.com](https://sales-incentive-backend.onrender.com) |
| 🗄️ **Database** | Active | **Neon Serverless PostgreSQL 17** (Singapore) |

> 📊 **Live Stats Dashboard**:
> - **94** Registered Users & Sales Executives
> - **112** Processed Deals & Transactions
> - **303+** Secured Audit Logs
> - **44** Active Performance Profiles

---

## 📋 Overview

The **Sales Reward Engine** is a comprehensive, multi-tenant incentive calculation solution designed for modern sales teams. It provides real-time commission tracking, dynamic policy management, automated deal approvals, and stunning performance analytics—all secured via organization-level data isolation.

---

## ✨ Key Enterprise Features

- 🎯 **Dynamic Incentive Engine** - Configure **Incentive** and **General Policies** (Flat Rate, Tiered, or Multiplier) that update in real-time.
- 🏢 **Multi-Tenant Data Isolation** - Administrators only see users, deals, targets, and audit logs within their own organization.
- 📊 **Performance Target Tracking** - Set individual monthly targets and track real-time achievements vs. goals.
- 🛡️ **Comprehensive System Auditing** - Detailed tracking of all critical actions with a searchable, organization-filtered log for Admins.
- 🚀 **Smart Onboarding Wizard** - Guided setup experience with role-specific tasks and progress tracking.
- 🔮 **What-If Simulator** - Enable sales reps to predict commissions accurately before finalizing a deal.
- 🏪 **Deal Lifecycle Management** - Automated workflows for submission, approval, and rejection with categorization.
- 🌓 **Aurora Glass UI** - Premium visually stunning interface supporting both strict Light and deep Dark modes.

---

## 🏗️ Tech Stack

### Frontend (Modern React)
- **React 18.2** with Vite 5.0
- **TailwindCSS 3.4** (Custom "Hyper-Glass" design system)
- **Recharts 2.12** (Interactive analytics & trends)
- **Lucide React** (Premium iconography)
- **Context API** (State management for Auth & Theme)

### Backend (Spring Boot Core)
- **Spring Boot 3.3.0** / **Java 21**
- **Spring Security 6.2** (JWT & Role-based authentication)
- **Spring JPA** (Hibernate 6.5)
- **PostgreSQL 17** (Neon Serverless API integration)
- **SendGrid API** (Automated invitations & communications)

---

## 📁 System Architecture

```text
Sales-Reward-Engine/
├── frontend/                 # React 18 / Tailwind / Vite
│   ├── src/
│   │   ├── api/             # authApi & standard interceptors
│   │   ├── components/      # Glass cards, Charts, Onboarding Wizard
│   │   ├── pages/           # Admin Dashboard, Audit Logs, Simulator
│   │   └── index.css        # Aurora meshes & custom theme tokens
│
├── SalesIncentiveSystem/    # Spring Boot 3.3 REST API
│   ├── src/main/java...
│   │   ├── config/          # JWT, CORS, Multi-tenant Security
│   │   ├── controllers/     # Secure Endpoints (Targets, Deals, Logs)
│   │   ├── models/          # JPA Entities (User, Deal, AuditLog)
│   │   └── services/        # Incentive Logic & Data Isolation
│   └── build.gradle
```

---

## 🚀 Development Setup

### 🖥️ Local Environment
1. **Clone & Install**
   ```bash
   git clone https://github.com/PrathamMrana/Sales-Reward-Engine.git
   cd Sales-Reward-Engine/frontend && npm install
   ```
2. **Launch Backend**
   ```bash
   cd ../SalesIncentiveSystem && ./gradlew bootRun
   ```
3. **Launch Frontend**
   ```bash
   cd ../frontend && npm run dev
   ```

---

## 👥 Demo Environment

| Role | Primary Email | Password |
| :--- | :--- | :--- |
| 👑 **Global Admin** | `admin@test.com` | `admin123` |
| 👨‍💼 **Org Admin** | `david@test.com` | `david123` |
| 🧑‍💻 **Sales Executive** | `sales@test.com` | `sales123` |

---

<div align="center">
  <p>Engineered with precision for high-performing sales organizations.</p>
</div>
