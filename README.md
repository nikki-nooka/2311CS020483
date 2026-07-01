# Campus Notification System (Full Stack)

This is a full-stack notification system built for campus updates. It includes a React frontend, an Express backend, and a custom logging middleware package that tracks events across the application.

## Project Structure
- `logging-middleware/`: A custom NPM package used by both the frontend and backend to send logs to the central evaluation server.
- `notification-app-be/`: The Express.js backend server.
- `notification-app-fe/`: The React frontend application.

## Screenshots

### Frontend (Desktop View)
*(Add desktop screenshot here)*

### Frontend (Mobile View)
*(Add mobile screenshot here)*

### Backend (Postman / Insomnia API Test)
*(Add backend API screenshot here)*

## Setup Instructions

### 1. Setup Logging Middleware
First, we need to link the local package so the other apps can use it.
```bash
cd logging-middleware
npm link
```

### 2. Run the Backend
```bash
cd ../notification-app-be
npm link campus-logging-middleware
npm install
npm run dev
```
The server will start on `http://localhost:5001`.

### 3. Run the Frontend
Open a new terminal:
```bash
cd notification-app-fe
npm link campus-logging-middleware
npm install
npm run dev
```
The React app will be running on `http://localhost:3000`.
