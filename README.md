# 🚗 ParkPal — Never Forget Where You Parked

A modern full-stack SaaS application to save, track, and manage your parking spots with photos, AI-generated notes, and interactive maps.

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React + Vite + Tailwind CSS       |
| Backend    | Express.js (Node.js)              |
| Database   | MongoDB Atlas                     |
| Storage    | Cloudinary                        |
| AI         | Google Gemini                     |
| Maps       | Leaflet + React-Leaflet           |
| HTTP       | Axios                             |
| Hosting    | Vercel (Frontend) + Render (API)  |
| Containers | Docker + Docker Compose           |

## Features

- ✅ Parking CRUD (Create, Read, Update, Delete)
- ✅ Cloudinary image upload
- ✅ Gemini AI parking note generation
- ✅ Interactive Leaflet map
- ✅ GPS location picker
- ✅ Responsive UI
- ✅ Dockerized development environment

---

## Getting Started (Without Docker)

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### Backend

```bash
# From project root
npm install

# Create server/.env with:
# MONGO_URI=your_mongodb_atlas_uri
# PORT=5000
# GEMINI_API_KEY=your_gemini_key

cd server
node server.js
```

### Frontend

```bash
cd client
npm install

# Create client/.env with:
# VITE_API_URL=http://localhost:5000

npm run dev
```

---

## 🐳 Running with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Configure Environment Variables

Make sure your environment files exist:

**`server/.env`**
```env
MONGO_URI=your_mongodb_atlas_uri
PORT=5000
GEMINI_API_KEY=your_gemini_key
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### 2. Build and Start All Services

```bash
docker compose up --build
```

This will:
- Build the **backend** container (Express + Node.js)
- Build the **frontend** container (React + Vite)
- Start both services with live reload enabled
- Connect them on a shared Docker network

### 3. Access the Application

| Service  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:5000         |

### 4. Common Docker Commands

```bash
# Start services (detached mode — runs in background)
docker compose up -d --build

# View logs (all services)
docker compose logs

# View logs (specific service)
docker compose logs backend
docker compose logs frontend

# Follow logs in real-time
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (clean reset)
docker compose down -v

# Restart all services
docker compose restart

# Restart a specific service
docker compose restart backend

# Rebuild a single service
docker compose up --build backend

# Check running containers
docker compose ps
```

### 5. Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Network                 │
│                                             │
│  ┌───────────────┐   ┌───────────────────┐  │
│  │   Frontend    │   │     Backend       │  │
│  │  React+Vite   │──▶│   Express.js      │  │
│  │  :5173        │   │   :5000           │  │
│  └───────────────┘   └────────┬──────────┘  │
│                               │             │
└───────────────────────────────┼─────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   MongoDB Atlas       │
                    │   (External Cloud)    │
                    └───────────────────────┘
```

> **Note:** MongoDB is NOT containerized. ParkPal connects to MongoDB Atlas (cloud) via the `MONGO_URI` in `server/.env`. Cloudinary and Google Gemini are also external cloud services accessed via API keys.

---

## Project Structure

```
where-did-i-park/
├── client/                  # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile           # Frontend container
│   ├── .dockerignore
│   └── .env
│
├── server/                  # Express.js backend
│   ├── config/
│   ├── models/
│   ├── ai.js
│   ├── server.js
│   ├── Dockerfile           # Backend container
│   └── .env
│
├── docker-compose.yml       # Orchestrates both services
├── .dockerignore            # Root Docker ignore
├── package.json             # Root (backend dependencies)
└── README.md
```

---

## Deployment

| Platform | Target   | Command             |
| -------- | -------- | ------------------- |
| Vercel   | Frontend | `vercel --prod`     |
| Render   | Backend  | Auto-deploy via Git |

---

## License

ISC
