# Campus Notification System (Full Stack)

This is a full-stack notification system built for campus updates. It includes a React frontend, an Express backend, and a custom logging middleware package that tracks events across the application.

## Project Structure
- `logging-middleware/`: A custom NPM package used by both the frontend and backend to send logs to the central evaluation server.
- `notification-app-be/`: The Express.js backend server.
- `notification-app-fe/`: The React frontend application.

## Screenshots

### Frontend (Desktop View)
<img width="1470" height="924" alt="Updates" src="https://github.com/user-attachments/assets/dc3b32c4-234f-4730-bfd5-ed649a956c96" />
<img width="1470" height="932" alt="Updates" src="https://github.com/user-attachments/assets/702c56d8-70fa-43c6-b37b-2c61120d3f34" />
<img width="1470" height="937" alt="Updates" src="https://github.com/user-attachments/assets/7dc90f3e-a0d1-41ca-b60e-44334e90594e" />
<img width="1470" height="955" alt="Updates" src="https://github.com/user-attachments/assets/10393bbe-88e4-4f5b-a60d-34680ed6720a" />
<img width="1470" height="930" alt="Screenshot 2026-07-01 at 12 40 03" src="https://github.com/user-attachments/assets/5c14e9cb-3c2e-4574-bd7e-6f6f2a377590" />



### Frontend (Mobile View)
<img width="1470" height="1838" alt="image" src="https://github.com/user-attachments/assets/23618662-e558-4f37-8e2d-4e69c3270eb6" />


### Backend (Postman / Insomnia API Test)
<img width="2938" height="1840" alt="image" src="https://github.com/user-attachments/assets/4336dbe1-0cbc-4cb6-ad7b-81b7d6f13080" />
<img width="2940" height="1824" alt="image" src="https://github.com/user-attachments/assets/7e28e3f8-aac7-48d7-8ad1-549bd2c5b27a" />
<img width="2940" height="1884" alt="image" src="https://github.com/user-attachments/assets/c837c658-0739-4044-a412-5607de7a3e84" />



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
