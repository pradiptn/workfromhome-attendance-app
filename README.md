# WFH Attendance Application
By Nathaniel Pradipta
> ⚠️ **Note:** This project was developed as part of a **technical test** / coding assessment.  
> It demonstrates fullstack development skills using NestJS, React, PostgreSQL, Docker, and modern frontend tools like Zustand and Zod.


A fullstack microservices-based web application for **Work From Home employee attendance tracking** with photo verification.

---

## Features

### Employee Features
- User registration and login
- Record attendance with photo upload
- Add optional notes to attendance records
- View personal attendance history

### Admin Features
- View all employee attendance records
- Manage employees (create, update, delete)
- Monitor employee work-from-home activities
---


## Tech Stack

**Backend (Microservices):**
- NestJS (Node.js framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Axios (HTTP requests between microservices)
- Multer (File upload)

**Frontend:**
- React.js with TypeScript
- Axios (HTTP client)
- React Router (Navigation)
- Zustand (State management)
- Zod (Form validation)
- Bootstrap & Bootstrap Icons (UI)

**DevOps:**
- Docker & Docker Compose (Containerized microservices)

---

## Microservices

| Service           | Port | Responsibilities                                  |
|------------------|------|--------------------------------------------------|
| Auth Service      | 3001 | User authentication, registration, JWT issuance |
| Employee Service  | 3002 | Employee CRUD and management                     |
| Attendance Service| 3003 | Record & retrieve attendance                     |
| API Gateway       | 4000 | Central entry point / proxy to all services     |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/pradiptn/workfromhome-attendance-app
cd workfromhome-attendance-app
```

### 2. Install All Dependencies
```bash
./install-all-dependencies.sh
```

### 3. Start Frontend
```bash
cd frontend
npm run start
```
### 4. Start Microservices
```bash
cd ../microservices
docker-compose up --build
```
- API Gateway: http://localhost:4000

## Default Admin Account

- **Email:** `admin@wfh.com`
- **Password:** `password`  

> Can log in to access admin dashboards and employee management.

---

## Troubleshooting

- **Docker permission error**
```bash
sudo usermod -aG docker $USER
newgrp docker
```
