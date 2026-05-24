# 🌌 QuizVerse-AI

[![React](https://img.shields.io/badge/Frontend-React%20%2F%20Vite-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-purple?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**QuizVerse-AI** is a premium, state-of-the-art, AI-powered gamified quiz platform. Built on the robust **MERN-like stack** (using MySQL with Sequelize instead of MongoDB), it features an **AI-driven quiz generator** powered by Google Gemini, real-time multiplayer competitive game lobbies utilizing WebSockets, and advanced interactive dashboards with gorgeous micro-animations and data visualizations.

---

## ✨ Features

### 🧑‍🎓 Student Experience
*   **Intuitive Student Dashboard:** View key performance cards, quick links, recent quiz attempts, and announcements in a modern workspace.
*   **Interactive Quiz Engine:** A beautiful, responsive quiz-taking terminal with an active progress bar, dynamic timers, and smooth question transitions.
*   **Multiplayer Quiz Arena:** Join live multiplayer rooms via Socket.IO, play against peers, and view instantaneous leaderboard updates on the live room screen.
*   **Dynamic Performance Reports:** Post-quiz reviews detailing correct/incorrect answers with custom Recharts graphs analyzing strength by category.
*   **Global Leaderboard:** Track ranks, scores, and competitive stats across the entire user base.
*   **Secure OTP Authentication:** Email-based verification using Nodemailer for seamless registration and account recovery.

### 👩‍🏫 Teacher Workspace
*   **AI Quiz Generation:** Instantly draft fully structured, educational quizzes on any subject, category, and difficulty using **Google Gemini AI**.
*   **Custom Manual Creator:** Fine-tune questions, define strict timers, add custom categories, and assign quizzes to students.
*   **Comprehensive Student Analytics:** Robust dashboards highlighting average test scores, quiz distribution charts, and user performance trends via custom graphs.
*   **Classroom Performance Reports:** Track individual student reports, quiz attempts, and category proficiencies.

### 🛡️ Admin Terminal
*   **Central Control Hub:** Monitor overall platform usage, active quizzes, and system metrics.
*   **User Management:** Modify user roles (Student, Teacher, Admin), lock/unlock accounts, and configure global variables.

---

## 🛠️ Technology Stack

| Part | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (v19) & TypeScript | Modern, high-performance UI library and type-safe language. |
| **Build Tool**| Vite | Ultra-fast frontend builder and hot-module reloading environment. |
| **Styling** | Tailwind CSS | Sleek utility-first CSS styling framework. |
| **Animations**| Framer Motion | Smooth, organic, and reactive transitions and UI states. |
| **Visuals** | Recharts & Lucide Icons | Responsive charts and vector icon libraries. |
| **Backend** | Node.js & Express | Fast, scalable, asynchronous JavaScript backend server. |
| **Database** | MySQL & Sequelize ORM | Relational database modeling, migrations, and robust schema queries. |
| **Sockets** | Socket.io | Bi-directional, low-latency WebSocket communication for multiplayer lobbies. |
| **Generative AI**| `@google/generative-ai` | Integrates Google Gemini Flash models for instant quiz creation. |
| **Mailing** | Nodemailer | SMTP client configuration for registering and resetting password OTPs. |

---

## 📂 Project Structure

```text
QuizVerse-AI/
├── backend/
│   ├── config/             # DB & API client setups (Sequelize, Gemini)
│   ├── controllers/        # Core business logic (Auth, Quizzes, Analytics, Multiplayer)
│   ├── middleware/         # Auth guards, role-checks, validation, & rate-limiters
│   ├── models/             # Sequelize database schemas & model relationships
│   ├── routes/             # API routing endpoints (Express)
│   ├── services/           # Gemini AI generation & Email services
│   ├── sockets/            # Socket.io event-listeners for multiplayer
│   ├── utils/              # Seeders, JWT helpers, & unified response standards
│   ├── .env.example        # Reference environment configuration
│   └── server.js           # Server bootstrap file
│
├── frontend/
│   ├── public/             # Static public assets (icons, images)
│   ├── src/
│   │   ├── api/            # Axios API config with interceptors
│   │   ├── assets/         # Raw static media assets
│   │   ├── components/     # Reusable UI & Core layouts
│   │   ├── context/        # React Global contexts (Auth, Socket, Theme)
│   │   ├── layouts/        # Dashboard wrapper structures
│   │   ├── pages/          # All major role-based pages (Auth, Students, Teachers, Admin)
│   │   ├── App.jsx         # App router and theme provider setup
│   │   └── main.jsx        # App entry point
│   ├── .env.example        # Reference environment configuration
│   └── vite.config.js      # Vite compilation configuration
```

---

## 🚀 Setup & Installation

### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v16+ recommended)
*   [MySQL Server](https://www.mysql.com/) (or XAMPP / WampServer running MySQL)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/rohanhalaj18/QuizVerse-AI.git
cd QuizVerse-AI
```

---

### Step 2: Configure the Backend

1.  **Navigate to the backend folder & install dependencies:**
    ```bash
    cd backend
    npm install
    ```

2.  **Set up your environment variables:**
    Copy `.env.example` to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    Open the newly created `.env` file and input your credentials:
    ```ini
    # --- Database (MySQL / XAMPP) ---
    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=quizverse_db
    DB_USER=root
    DB_PASS=your_mysql_password_here

    # --- JWT Secret ---
    JWT_SECRET=generate_a_secure_long_secret_key_here

    # --- Gemini AI Key ---
    GEMINI_API_KEY=your_google_gemini_api_key

    # --- Email (Gmail SMTP for OTPs) ---
    EMAIL_USER=your_gmail_address@gmail.com
    EMAIL_PASS=your_gmail_app_password_here
    EMAIL_FROM=QuizVerse AI <your_gmail_address@gmail.com>
    ```

3.  **Database Creation & Seed Execution:**
    *   Start your MySQL server (via XAMPP or local service).
    *   Create a database named `quizverse_db` in your MySQL console:
        ```sql
        CREATE DATABASE quizverse_db;
        ```
    *   Run the database seeder to populate default roles, admins, teachers, students, and categories:
        ```bash
        npm run seed
        ```

4.  **Launch the Backend Server:**
    ```bash
    npm run dev
    ```
    The server will startup on `http://localhost:5000`.

---

### Step 3: Configure the Frontend

1.  **Navigate to the frontend folder & install dependencies:**
    Open a new terminal window at the repository root and run:
    ```bash
    cd frontend
    npm install
    ```

2.  **Set up environment variables:**
    Copy `.env.example` to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    *(The default endpoints point directly to `http://localhost:5000` which works perfectly out of the box).*

3.  **Launch the Frontend Application:**
    ```bash
    npm run dev
    ```
    The frontend client will spin up on `http://localhost:5173`. Open this URL in your browser to begin exploring!

---

## 👥 Seed User Credentials

If you populated the database using `npm run seed`, you can immediately log in with the following preset credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@quizverse.com` | `Admin@123` | Full control dashboard & user manager. |
| **Teacher** | `teacher@quizverse.com` | `Teacher@123` | AI & manual quiz generator, class analytics. |
| **Student** | `student@quizverse.com` | `Student@123` | Solitary quizzes, real-time multiplayer, reports. |

---

## 🔒 Security Best Practices
*   **Route Protection:** Standard JWT interceptors protect all endpoints, while customized Express middlewares (`auth.js`, `roleCheck.js`) validate incoming calls.
*   **AI Guardrails:** Query sanitation constraints prevent prompt injection when executing Gemini requests.
*   **Security Headers:** Helmet.js integrated to shield from malicious scripts, standard XSS vectors, and frame-jacking.
*   **Rate Limiting:** Express-rate-limit bounds auth requests to mitigate automated brute-force attempts.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
