# Chat Application

A production-ready real-time chat application built with the MERN stack, featuring Docker containerization and WebSocket communication.

## Overview

This is a full-stack real-time chat application that enables users to communicate instantly through a modern, responsive interface. Built using MongoDB, Express.js, React.js, and Node.js, with Socket.IO for real-time bidirectional communication.

## Features

- **User Authentication**: Secure sign up, log in, and log out with JWT tokens
- **Real-time Messaging**: Instant message delivery using WebSocket (Socket.IO)
- **Online User Status**: See who's currently online in real-time
- **Conversation Management**: Create and manage one-on-one conversations
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful interface built with Tailwind CSS and DaisyUI
- **Docker Support**: Fully containerized with Docker and docker-compose
- **Production Ready**: Optimized builds, health checks, and security features

## Tech Stack

### Backend
- **Node.js** (v20.12.2): JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling
- **Socket.IO**: Real-time bidirectional event-based communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Frontend
- **React.js**: UI library
- **Vite**: Next-generation frontend build tool
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind CSS component library
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Socket.IO Client**: Real-time communication

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Alpine Linux**: Minimal base image

## Project Structure

```
CHAT-APPLICATION/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── socket/           # Socket.IO configuration
│   ├── db/              # Database connection
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   └── zustand/     # State management
│   └── dist/            # Build output
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose configuration
└── .dockerignore       # Docker ignore patterns
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CHAT-APPLICATION
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   MONGO_DB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your_secure_random_string
   CLIENT_URL=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the application**

   Option A - Run both services separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   Option B - Build and run production mode:
   ```bash
   npm run build
   npm start
   ```

   The application will be available at:
   - Frontend: http://localhost:3000 (dev) or http://localhost:5000 (production)
   - Backend API: http://localhost:5000/api

### Docker Deployment

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

**Quick start with Docker Compose:**

```bash
# 1. Configure environment variables
cp .env.example .env
# Edit .env with your settings

# 2. Build and start services
docker-compose up --build

# Access at http://localhost:5000
```

## Docker Submission Requirements

This project meets all Docker submission requirements:

✅ **Pinned Base Image**: Uses `node:20.12.2-alpine3.19` (no `:latest`)  
✅ **Pinned Package Versions**: All dependencies have exact versions in `package.json`  
✅ **Minimal Packages**: Uses `apk` with `--no-cache` (Alpine equivalent of `--no-install-recommends`)  
✅ **Multi-stage Build**: Optimized build process for smaller final image  
✅ **Security**: Runs as non-root user, includes health checks  
✅ **Reproducible Builds**: Uses `npm ci` for deterministic dependency installation  

### Building and Pinning by Digest

```bash
# Build the image
docker build -t chat-application:v1.0.0 .

# Get the image digest
docker inspect chat-application:v1.0.0 --format='{{.Id}}'

# Or get digest after pushing to registry
docker images --digests chat-application
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Log in user
- `POST /api/auth/logout` - Log out user

### Users
- `GET /api/users` - Get all users (authenticated)

### Messages
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages/send/:id` - Send message to user

### Health Check
- `GET /api/health` - Container health check endpoint

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_DB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) | Yes | `http://localhost:3000` |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Node environment | No | `development` |

## Deployment Guides

- **Docker Deployment**: See [DOCKER.md](DOCKER.md)
- **Cloud Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway + Vercel

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- HTTP-only cookies for token storage
- CORS configuration
- Non-root container user
- Input validation and sanitization
- Secure MongoDB connection

## Development

### Available Scripts

```bash
# Backend development with hot reload
npm run server

# Production start
npm start

# Build frontend
npm run build

# Install dependencies
npm install
```

### Frontend Scripts

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGO_DB_URI` in `.env`
   - For MongoDB Atlas, whitelist your IP address

2. **CORS Errors**
   - Verify `CLIENT_URL` matches your frontend URL
   - Check that credentials are included in fetch requests

3. **Socket.IO Connection Failed**
   - Ensure `VITE_SOCKET_URL` matches backend URL
   - Check firewall settings

4. **Docker Build Fails**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild: `docker-compose build --no-cache`

## Contributing

This is a private repository. Contributions are limited to authorized collaborators.

## License

ISC

## Acknowledgments

This project was built with inspiration from the programming community.
Special thanks to "As a Programmer" YouTube channel for educational content.

## Repository Attestation

**This repository is private and has never been published publicly.** This is an original implementation built for learning purposes and is not a fork, mirror, or derivative of any public repository or known starter template.
