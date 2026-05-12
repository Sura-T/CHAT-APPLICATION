# Docker Deployment Guide

This guide explains how to build and deploy the Chat Application using Docker.

## Quick Start with Docker Compose

The easiest way to run the application with Docker:

```bash
# 1. Create .env file from example
cp .env.example .env

# 2. Edit .env with your configuration
# Edit MONGO_DB_URI, JWT_SECRET, etc.

# 3. Build and start all services
docker-compose up --build

# The app will be available at http://localhost:5000
```

## Manual Docker Build

### Prerequisites

- Docker installed (version 20.10+)
- Docker Compose (optional, for MongoDB)

### Building the Docker Image

```bash
# Build the image with a specific tag
docker build -t chat-application:v1.0.0 .

# Build and output the image ID
docker build -t chat-application:v1.0.0 --iidfile=image-id.txt .
```

### Getting the Image Digest (for pinning)

```bash
# After building, get the digest
docker inspect chat-application:v1.0.0 --format='{{index .RepoDigests 0}}'

# Or if pushed to a registry
docker images --digests chat-application
```

### Running the Container

#### Option 1: With Docker Run (manual MongoDB)

```bash
docker run -d \
  --name chat-app \
  -p 5000:5000 \
  -e MONGO_DB_URI=mongodb://host.docker.internal:27017/chat-app \
  -e JWT_SECRET=your_secure_jwt_secret \
  -e CLIENT_URL=http://localhost:5000 \
  -e NODE_ENV=production \
  chat-application:v1.0.0
```

#### Option 2: With Docker Compose (includes MongoDB)

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (data)
docker-compose down -v
```

## Environment Variables

Required environment variables for the container:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_DB_URI` | MongoDB connection string | `mongodb://mongodb:27017/chat-app` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secure_random_string` |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) | `http://localhost:3000,https://app.example.com` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port (optional) | `5000` |

## Docker Image Features

### Base Image
- **Node.js 20.12.2** on Alpine Linux 3.19 (pinned, no `:latest`)
- Security updates applied via `apk upgrade`

### Multi-stage Build
1. **Builder stage**: Installs all dependencies and builds frontend
2. **Production stage**: Only includes production dependencies and built assets

### Security Features
- Runs as non-root user (`nodejs:nodejs`)
- Minimal attack surface (Alpine Linux)
- No unnecessary packages installed
- Security updates applied

### Size Optimization
- Multi-stage build reduces final image size
- Only production dependencies included
- npm cache cleaned after installation

### Health Check
Built-in health check endpoint at `/api/health`:
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' chat-app

# Manual health check
curl http://localhost:5000/api/health
```

## Building for Production Deployment

### Step 1: Build the Image

```bash
docker build -t chat-application:production .
```

### Step 2: Pin by Digest

```bash
# Get the image digest
IMAGE_DIGEST=$(docker inspect chat-application:production --format='{{.Id}}')
echo "Image Digest: $IMAGE_DIGEST"

# Tag with digest
docker tag chat-application:production chat-application@$IMAGE_DIGEST
```

### Step 3: Push to Registry (if deploying remotely)

```bash
# Tag for your registry
docker tag chat-application:production your-registry.com/chat-application:v1.0.0

# Push to registry
docker push your-registry.com/chat-application:v1.0.0

# Get the digest from the registry
docker inspect your-registry.com/chat-application:v1.0.0 --format='{{index .RepoDigests 0}}'
```

## Package Version Pinning

All dependencies are pinned in `package.json`:
- Backend: Exact versions specified
- Frontend: Exact versions specified
- Using `npm ci` for reproducible builds

## Troubleshooting

### Container won't start

```bash
# Check container logs
docker logs chat-app

# Check if container is running
docker ps -a

# Inspect container
docker inspect chat-app
```

### MongoDB connection issues

```bash
# If using docker-compose, ensure MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection from app container
docker-compose exec app sh
# Inside container:
# nc -zv mongodb 27017
```

### Build failures

```bash
# Clear Docker cache and rebuild
docker build --no-cache -t chat-application:v1.0.0 .

# Check if Docker has enough resources
docker system df
docker system prune
```

### Port conflicts

```bash
# Check what's using port 5000
# Windows PowerShell:
netstat -ano | findstr :5000

# Change port in docker-compose.yml or docker run command
docker run -p 8080:5000 ...
```

## Advanced Configuration

### Custom Build Arguments

```dockerfile
# Add to Dockerfile if needed
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine3.19
```

```bash
# Build with custom argument
docker build --build-arg NODE_VERSION=20.12.2 -t chat-application:v1.0.0 .
```

### Volume Mounting for Development

```bash
# Mount source code for development (hot reload)
docker run -d \
  -p 5000:5000 \
  -v $(pwd)/backend:/app/backend \
  -e NODE_ENV=development \
  chat-application:v1.0.0 \
  npm run server
```

## CI/CD Integration

Example GitHub Actions workflow snippet:

```yaml
- name: Build Docker image
  run: docker build -t chat-application:${{ github.sha }} .

- name: Get image digest
  run: docker inspect chat-application:${{ github.sha }} --format='{{.Id}}' > digest.txt

- name: Push to registry
  run: |
    docker tag chat-application:${{ github.sha }} registry.example.com/chat-app:${{ github.sha }}
    docker push registry.example.com/chat-app:${{ github.sha }}
```

## Production Checklist

- [ ] Set secure `JWT_SECRET` (use a random 64-character string)
- [ ] Configure proper `MONGO_DB_URI` (use MongoDB Atlas or managed database)
- [ ] Set correct `CLIENT_URL` (your frontend domain)
- [ ] Use HTTPS in production
- [ ] Set up proper logging and monitoring
- [ ] Configure resource limits (CPU, memory)
- [ ] Set up automated backups for MongoDB
- [ ] Use secrets management (not environment variables in plain text)
- [ ] Enable container security scanning
- [ ] Set up health check monitoring

## Resource Limits (Production)

```bash
# Run with resource limits
docker run -d \
  --name chat-app \
  --memory="512m" \
  --cpus="1.0" \
  -p 5000:5000 \
  -e MONGO_DB_URI=your_uri \
  -e JWT_SECRET=your_secret \
  chat-application:v1.0.0
```

Or in `docker-compose.yml`:

```yaml
services:
  app:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Support

For issues with Docker deployment:
1. Check container logs: `docker logs chat-app`
2. Verify environment variables: `docker inspect chat-app`
3. Test health endpoint: `curl http://localhost:5000/api/health`
4. Check network connectivity between containers
