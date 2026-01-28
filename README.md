# Sales Reward Engine 🚀

A beautiful and powerful sales incentive tracking system with a modern React frontend and Spring Boot backend.

## 📋 Prerequisites

Before running the project, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Java JDK 22** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Gradle** (optional, wrapper included) - [Download](https://gradle.org/)

## 🏃 Quick Start

### 1. Start the Backend (Spring Boot)

Open a terminal and navigate to the backend directory:

```bash
cd SalesIncentiveSystem
```

Run the Spring Boot application:

**On macOS/Linux:**
```bash
./gradlew bootRun
```

**On Windows:**
```bash
gradlew.bat bootRun
```

The backend will start on **http://localhost:8080**

> 💡 **Note:** The backend uses H2 in-memory database. You can access the H2 console at http://localhost:8080/h2-console
> - JDBC URL: `jdbc:h2:mem:testdb`
> - Username: `sa`
> - Password: (leave empty)

### 2. Start the Frontend (React + Vite)

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies (first time only):
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy)

## 🎯 Access the Application

Once both servers are running:

1. Open your browser and go to: **http://localhost:5173**
2. You'll see the beautiful login page
3. Use any email to login (demo mode)
   - Use `admin@test.com` for Admin role
   - Use any other email for Sales role

## 📁 Project Structure

```
Sales_Incentives/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── auth/            # Authentication components
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   └── context/         # React context providers
│   └── package.json
│
└── SalesIncentiveSystem/    # Spring Boot backend
    ├── src/main/java/       # Java source code
    └── build.gradle         # Gradle build configuration
```

## 🛠️ Available Scripts

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Commands

- `./gradlew bootRun` - Run the application
- `./gradlew build` - Build the project
- `./gradlew test` - Run tests

## 🎨 Features

- ✨ Beautiful modern UI with gradients and animations
- 📊 Real-time sales dashboard
- 🧮 Incentive calculator
- 📈 Deal history tracking
- 🔐 Role-based authentication
- 📱 Responsive design

## 🔧 Troubleshooting

### Port Already in Use

If port 8080 (backend) or 5173 (frontend) is already in use:

**Backend:** Change the port in `application.properties`:
```properties
server.port=8081
```

**Frontend:** Vite will automatically use the next available port, or you can specify:
```bash
npm run dev -- --port 3000
```

### Dependencies Issues

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
cd SalesIncentiveSystem
./gradlew clean build
```

## 📝 Notes

- The backend uses H2 in-memory database, so data resets when you restart the server
- Authentication is currently in demo mode (no real backend validation)
- All UI improvements are complete - the application is ready to use!

## 🚀 Production Build

To build for production:

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

**Backend:**
```bash
cd SalesIncentiveSystem
./gradlew build
```

The JAR file will be in `SalesIncentiveSystem/build/libs/`

---

**Enjoy your Sales Reward Engine! 🎉**

