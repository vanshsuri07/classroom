# 🏫 Classroom Management System

<div align="center">

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<br />

<div align="center">
  <p align="center">
    A robust, full-stack Classroom Management System built with modern web technologies and industry-standard DevOps practices. Designed for scalability, maintainability, and ease of deployment.
    <br />
    <a href="#-getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#-issues">Report Bug</a>
    ·
    <a href="#-feature-request">Request Feature</a>
  </p>
</div>

---

## 📸 Screenshots

<div align="center">
  <!-- REPLACE WITH YOUR ACTUAL SCREENSHOTS -->
  <img src="https://via.placeholder.com/800x400?text=Dashboard+View" alt="Dashboard" width="800"/>
  <br/><br/>
  <div style="display: flex; justify-content: center; gap: 20px;">
    <img src="https://via.placeholder.com/380x250?text=Class+Management" alt="Class Management" width="45%"/>
    <img src="https://via.placeholder.com/380x250?text=Student+Analytics" alt="Analytics" width="45%"/>
  </div>
</div>

> **Note**: *Screenshots are placeholders. Please update with actual application images.*

---

## 🚀 About The Project

**Classroom** is a comprehensive platform designed to streamline educational processes. It connects teachers and students, facilitates assignment tracking, and provides real-time analytics.

The project is architected with a microservices-ready mindset, utilizing a separate frontend and backend, containerized with **Docker**, and orchestrated via **Kubernetes**. It features a fully automated **CI/CD pipeline** using GitHub Actions to ensure code quality and seamless deployments.

---

## 🛠 Tech Stack

### **Frontend**
*   ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat-square) **React** (Vite)
*   ![Refine](https://img.shields.io/badge/-Refine-1890FF?logo=refine&logoColor=white&style=flat-square) **Refine** Framework
*   ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square) **Tailwind CSS** & Shadcn UI
*   ![Recharts](https://img.shields.io/badge/-Recharts-22b5bf?style=flat-square) **Recharts** for Analytics

### **Backend**
*   ![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) **Node.js** & Express
*   ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) **TypeScript**
*   ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) **PostgreSQL**
*   ![Drizzle](https://img.shields.io/badge/-Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black&style=flat-square) **Drizzle ORM**
*   ![Better Auth](https://img.shields.io/badge/-Better_Auth-FF5733?style=flat-square) **Better Auth**

### **DevOps & Infrastructure**
*   ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=flat-square) **Docker** & Docker Compose
*   ![K8s](https://img.shields.io/badge/-Kubernetes-326CE5?logo=kubernetes&logoColor=white&style=flat-square) **Kubernetes**
*   ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?logo=github-actions&logoColor=white&style=flat-square) **GitHub Actions** (CI/CD)
*   ![Nginx](https://img.shields.io/badge/-Nginx-009639?logo=nginx&logoColor=white&style=flat-square) **Nginx Ingress**

---

## ♾️ DevOps Architecture

This project implements a complete DevOps lifecycle.

### **CI/CD Pipeline**
Automated workflows using **GitHub Actions**:
1.  **Docker Build**: On push to `main`, Docker images for Frontend and Backend are built.
2.  **Push to Registry**: Images are tagged with the commit SHA and pushed to Docker Hub (`vanshsuri07/classroom-*`).
3.  **Deploy to K8s**: The manifest files are updated with the new image tags, and `kubectl` commands apply the changes to the cluster.

### **Kubernetes Cluster**
The application runs on a Kubernetes cluster with the following components:
*   **Ingress Controller**: Routes traffic to Backend (`/api`) and Frontend (`/`).
*   **Services**: `LoadBalancer` for Backend, `NodePort` for Frontend (Internal communication).
*   **Deployments**: Scalable pods for both services with health checks (Liveness/Readiness probes).
*   **Secrets**: Secure management of credentials (DB URL, API Keys).

---

## 🏁 Getting Started

### Prerequisites
*   [Docker](https://www.docker.com/) installed
*   [Node.js](https://nodejs.org/) (v18+)
*   [pnpm](https://pnpm.io/)

### 🐳 Run with Docker Compose (Recommended)

The easiest way to spin up the entire stack.

```bash
# Clone the repository
git clone https://github.com/vanshsuri07/classroom.git
cd classroom

# Start services
docker-compose up --build -d
```

The application will be available at:
*   **Frontend**: `http://localhost:3000`
*   **Backend**: `http://localhost:8000`

### 🔧 Manual Setup

#### Backend
```bash
cd classroom-backend
cp .env.example .env  # Configure your environment variables
pnpm install
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations
pnpm dev
```

#### Frontend
```bash
cd classroom-frontend
pnpm install
pnpm dev
```

---

## 🎡 Deployment

### Kubernetes Deployment
Ensure you have `kubectl` configured and pointing to your cluster.

1.  **Apply Secrets**:
    ```bash
    kubectl create secret generic backend-secrets --from-literal=DATABASE_URL=<your_db_url>
    ```

2.  **Deploy Resources**:
    ```bash
    kubectl apply -f k8s/backend.yml
    kubectl apply -f k8s/frontend.yml
    kubectl apply -f k8s/ingress.yml
    ```

3.  **Access the App**:
    Add `127.0.0.1 classroom.local` to your `/etc/hosts` file (if running locally/minikube) to access via ingress.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

Vansh Suri - [@vanshsuri](https://github.com/vanshsuri07)

Project Link: [https://github.com/vanshsuri07/classroom](https://github.com/vanshsuri07/classroom)
