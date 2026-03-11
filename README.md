# Blog Platform

A full stack blog platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register, login, logout)
- Create, edit, and delete blog posts
- Comment on posts
- View user profiles
- Protected routes

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**Frontend**
- React
- React Router
- Axios
- Vite

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas account

### Run the Backend
```bash
cd server
npm install
npm run dev
```

### Run the Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables
## Project Structure
```
blog-platform/
├── server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── client/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── api/
```
