# Recipe Management System - Docker Containerization


##  Task Overview

This repository contains a fully containerized recipe management system application that has completed the SIT725 high-resolution task. The application is Dockerized to run end-to-end, including the front-end, back-end, and MongoDB database.

### Task Requirements Completed

 **Entire application containerized** - Frontend, backend, and database all run in Docker containers  
 **Database integration functional** - MongoDB runs in container and connects successfully  
 **Student identity endpoint** - `/api/student` route returns student name and ID    

---

##  How to Build and Start the Application

### Prerequisites

Before running the application, ensure you have the following installed:

- **Docker Desktop** (or Docker Engine + Docker Compose)
  - Download from: https://www.docker.com/products/docker-desktop
  - For Windows: Requires WSL2 backend
  - Verify installation: `docker --version` and `docker-compose --version`

### Setup Steps

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Recipe-Management-System
   ```

2. **No additional setup required!**
   - All configuration is included in `docker-compose.yml`
   - Default values are provided for all environment variables

### Build and Start

From the `Recipe-Management-System` directory, run:

```bash
docker-compose up --build
```

**What happens:**
- Docker builds the backend image using `backend/Dockerfile`
- Downloads MongoDB 7.0 image 
- Creates and starts both containers
- MongoDB initializes first 
- Backend connects to MongoDB and starts the server
- Application becomes available at `http://localhost:5001`

**First run:** Takes a few minutes to build images and download dependencies  
**Subsequent runs:** Use `docker-compose up` (faster, uses cached images)

**Run in background:** `docker-compose up -d` 

### Stop the Application

Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

**To remove volumes (deletes database data):**
```bash
docker-compose down -v
```

##  Access the Application

### Web Application
- **URL:** `http://localhost:5001`
- **Port:** 5001 (mapped from container port 5000)

### Student Identity Endpoint
- **URL:** `http://localhost:5001/api/student`
- **Method:** GET
- **Response:**
  ```json
  {
    "name": "Anushi Amarasinghe",
    "studentId": "s224727365"
  }
  ```

### MongoDB Access 
- **Port:** 27017
- **Connection String:** `mongodb://localhost:27017/recipes_db`

##  Configuration

### Environment Variables

All configuration is handled via `docker-compose.yml`. The following environment variables are set:

- **PORT:** 5000 (inside container)
- **MONGO_URI:** `mongodb://mongodb:27017/recipes_db` (connects to MongoDB container)
- **JWT_SECRET:** `supersecretkey` (default, can be overridden)
- **NODE_ENV:** `production`

### Sensitive Information

- No sensitive values are hard-coded in the repository
- Default values are provided in `docker-compose.yml` for easy testing

---

##  Project Structure

```
Recipe-Management-System/
├── backend/                 # Node.js backend application
│   ├── Dockerfile          # Docker image build instructions
│   ├── .dockerignore       # Files excluded from Docker build
│   ├── server.js           # Application entry point
│   ├── app.js              # Express app configuration
│   ├── routes/             # API routes (including /api/student)
│   ├── models/             # MongoDB models
│   └── ...
├── frontend/               # Static HTML/CSS/JS frontend
├── docker-compose.yml      # Multi-container orchestration
├── README.md              # This file

```

---

##  Testing the Application

### 1. Verify Containers are Running

```bash
docker ps
```

You should see two containers:
- `recipe-mongodb` (MongoDB)
- `recipe-backend` (Node.js application)

### 2. Test Student Endpoint

Open your browser or use curl:
```bash
curl http://localhost:5001/api/student
```

Expected response:
```json
{"name":"Anushi Amarasinghe","studentId":"s224727365"}
```

### 3. Test Web Application

1. Open `http://localhost:5001` in your browser
2. Register a new user account
3. Log in with your credentials
4. Create a recipe (test database functionality)
5. Verify all features work end-to-end

### 4. Check Logs

View application logs:
```bash
docker-compose logs backend
```

View MongoDB logs:
```bash
docker-compose logs mongodb
```

---

##  Docker Architecture

The application uses a multi-container setup:

- **MongoDB Container:** Runs MongoDB 7.0, data persisted in `mongodb_data` volume
- **Backend Container:** Runs Node.js app, serves frontend, connects to MongoDB
- **Network:** Both containers on `recipe-network` for service discovery
- **Volumes:** 
  - `mongodb_data`: Persistent database storage
  - `./backend/uploads`: Recipe images 

