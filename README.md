# Thakral Global Learning (TGL) — Enterprise Learning Management System

An enterprise-grade, multi-tenant AI-powered Learning Management System (LMS) built with Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

---

## 🌟 Overview

The **Thakral Global Learning (TGL) LMS** is a full-featured enterprise solution providing end-to-end learning management, course creation, role-based dashboards, AI-assisted learning with Retrieval-Augmented Generation (RAG), real-time analytics, automated certificates, and comprehensive administrative oversight.

---

## ✨ Key Features & Modules

### 🌐 1. Public Portal
- Dynamic landing page with feature highlights, course catalog preview, user testimonials, and FAQ.
- Public Course Directory with search, category filtering, and level indicators.
- Interactive Contact and Support pages.

### 🔐 2. Authentication & Role-Based Access Control (RBAC)
- Multi-role authentication system supporting **Student**, **Instructor**, and **Admin**.
- Secure session management and API authorization middleware.
- Strict role isolation between Student, Instructor, and Admin workspaces.

### 🎓 3. Student Portal
- **Dashboard**: Personalized learning hub showing active enrollments, course progress, upcoming deadlines, and recent activity.
- **My Courses**: Enrolled courses list with progress bars, completed lessons count, and quick resume.
- **Interactive Course Player**: Video lesson playback, rich markdown text content, downloadable attachments, and module navigation.
- **Quiz Engine**: Interactive quizzes, timed assessments, instant grading, and review breakdowns.
- **Certificate Hub**: Auto-generated completion certificates with downloadable PDF views and verification IDs.
- **Analytics & Progress**: Visual learning statistics, study hours, quiz scores, and course completion metrics.

### 👨‍🏫 4. Instructor Portal
- **Instructor Dashboard**: Overview of assigned courses, total enrolled students, pending grading, and student engagement metrics.
- **Course Builder**: Intuitive drag-and-drop course management, module hierarchy, lesson creation, video upload integration, and quiz creation.
- **Quiz & Assignment Manager**: Create timed quizzes, set passing scores, and review student submission results.
- **Student Analytics**: Track student progress across modules, analyze quiz pass rates, and identify struggling learners.

### 🛠️ 5. Admin Portal
- **Admin Dashboard**: System-wide performance metrics, user growth charts, course stats, and platform activity logs.
- **User Management**: Granular control over users, role assignment (Student/Instructor/Admin), account suspension, and password resets.
- **Course Management**: Approve/publish instructor courses, archive outdated content, and manage categories.
- **System Settings**: Platform branding, email notification triggers, feature flags, and database maintenance settings.
- **Audit & Security Logs**: Security events monitoring, login audit trails, and role changes tracking.

### 🤖 6. AI Assistant & RAG Learning Engine
- **AI Learning Assistant**: Context-aware AI tutor embedded directly inside lessons.
- **RAG Knowledge Base**: Answers student queries based strictly on uploaded course materials and transcript embeddings.
- **Smart Quiz Generator**: Generates practice questions tailored to current course topics.
- **Progress Recommendations**: Recommends review modules based on student quiz history.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **State & UI**: React Server Components & Client Hooks

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x installed
- npm, yarn, or pnpm
- PostgreSQL database instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chathu-Jayarathna/lms.git
   cd lms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your local or hosted PostgreSQL connection string:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database & Run Migrations:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Open the Application:**
   Navigate to `http://localhost:3000` in your browser.

---

## 📁 Directory Structure

```
├── prisma/
│   ├── schema.prisma       # Prisma Database Schema
│   └── seed.ts             # Database Seeding Script
├── public/                 # Static Assets & Images
├── src/
│   ├── app/                # Next.js App Router Pages & API Routes
│   │   ├── (auth)/         # Auth Routes (Login, Register)
│   │   ├── admin/          # Admin Portal Workspaces
│   │   ├── api/            # REST API Endpoints & Auth Handlers
│   │   ├── courses/        # Course Catalog & Course Player
│   │   ├── dashboard/      # Student Dashboard Workspaces
│   │   └── instructor/     # Instructor Workspaces
│   ├── components/         # Reusable UI & Layout Components
│   └── lib/                # Database Client, AI Logic, & Utilities
├── .env.example            # Environment Variables Template
├── README.md               # Project Documentation
└── package.json            # Dependencies & Scripts
```

---

## 📜 Available Scripts

- `npm run dev` — Launches the development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Starts the production Next.js server.
- `npm run lint` — Runs ESLint code quality checks.
- `npx prisma studio` — Opens the visual Prisma database editor.

---

## 📄 License

This project is proprietary software developed for Thakral Global Learning (TGL). All rights reserved.
