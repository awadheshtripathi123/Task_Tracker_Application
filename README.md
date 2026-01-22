# Task Tracker System (MERN + PWA + Socket.IO)

A full-stack Task Tracker System built using MERN stack with JWT authentication, role-based access control, real-time updates using Socket.IO, and Progressive Web App (PWA) support.

This project allows users to manage tasks, collaborate in real time, and provides an admin panel for overall task control.



Features

Authentication & Security

- User Registration & Login
- JWT-based Authentication
- Access Token & Refresh Token mechanism
- Password hashing using bcrypt
- Secure Logout
- Protected Routes

User Management
- View logged-in user profile
- Role-based access (User / Admin)

Task Management
- Create tasks
- Assign tasks to multiple users
- View tasks assigned to logged-in user
- Update task status (To Do / In Progress / Done)
- Delete tasks
- Admin can view and delete **all tasks**

Real-Time Updates
- Live task updates using **Socket.IO**
- Task creation, update, and deletion reflected instantly

Progressive Web App (PWA)
- Installable on desktop & mobile
- Offline support (cached app shell)
- Fast loading performance


Tech Stack

Frontend

- React.js (Create React App – PWA template)
- React Router v6
- Axios
- Socket.IO Client
- Plain CSS (no UI library)

Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Socket.IO





