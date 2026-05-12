# Quick Start Guide - Docker Submission

This guide will help you quickly build, test, and prepare your Docker image for submission.

## Prerequisites Check

```bash
# Check Docker is installed
docker --version
# Should show: Docker version 20.10.x or higher

# Check Docker Compose is installed
docker-compose --version
# Should show: docker-compose version 1.29.x or higher
```

## Step 1: Prepare Environment

```bash
# Navigate to project directory
cd CHAT-APPLICATION

# Create environment file
cp .env.example .env

# Edit .env with your settings (or use defaults for testing)
# Required: MONGO_DB_URI, JWT_SECRET
```

## Step 2: Build the Docker Image

```bash
# Build the image
docker build -t chat-application:v1.0.0 .

# Expected output: Successfully built [image-id]
# Expected output: Successfully tagged chat-application:v1.0.0
```

**Build should complete in 2-5 minutes depending on your system.**

## Step 3: Get Image Digest (For Pinning)

```bash
# Method 1: Get image ID (digest)
docker inspect chat-application:v1.0.0 --format='{{.Id}}'

# Method 2: View all image details
docker images --digests chat-application

# Save the digest for your records
docker inspect chat-application:v1.0.0 --format='{{.Id}}' > image-digest.txt
```

## Step 4: Test the Container

### Option A: Quick Test with Docker Compose (Recommended)

```bash
# Start all services (app + MongoDB)
docker-compose up -d

# Check if services are running
docker-compose ps
# Both 'app' and 'mongodb' should show 'Up'

# Check logs
docker-compose logs -f app

# Test health endpoint
curl http://localhost:5000/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Test in browser
# Open: http://localhost:5000

# Cleanup
docker-compose down
```

### Option B: Manual Test (Docker Run)

```bash
# Start MongoDB (if not using docker-compose)
docker run -d --name test-mongodb -p 27017:27017 mongo:7.0.9

# Run the application
docker run -d \
  --name chat-app-test \
  -p 5000:5000 \
  -e MONGO_DB_URI=mongodb://host.docker.internal:27017/chat-app \
  -e JWT_SECRET=test_jwt_secret_12345 \
  -e CLIENT_URL=http://localhost:5000 \
  -e NODE_ENV=production \
  chat-application:v1.0.0

# Check if container is running
docker ps | grep chat-app-test

# View logs
docker logs -f chat-app-test

# Test health endpoint
curl http://localhost:5000/api/health

# Cleanup
docker stop chat-app-test test-mongodb
docker rm chat-app-test test-mongodb
```

## Step 5: Verify Compliance

Use the checklist to verify all requirements are met:

```bash
# 1. Check base image is pinned (no :latest)
grep "FROM" Dockerfile
# Should show: FROM node:20.12.2-alpine3.19

# 2. Check package versions are pinned
cat package.json | grep -A 20 '"dependencies"'

# 3. Check minimal package installation
grep "apk" Dockerfile
# Should show: apk upgrade --no-cache

# 4. Verify image can be pinned by digest
docker images --digests chat-application
```

## Step 6: Prepare for Submission

### Files to Submit

**Button 1 - Project Submission (All project files)**:
```
CHAT-APPLICATION/
├── backend/              (all backend files)
├── frontend/            (all frontend files)
├── patches/             (patch-package files)
├── package.json
├── .env.example
└── ... (other source files)
```

**Button 2 - Dockerfile Submission**:
```
CHAT-APPLICATION/
├── Dockerfile           ✅ REQUIRED
├── .dockerignore       ✅ REQUIRED
├── docker-compose.yml  ✅ RECOMMENDED
├── DOCKER.md           ✅ RECOMMENDED (documentation)
├── README.md           ✅ RECOMMENDED (updated)
└── SUBMISSION_CHECKLIST.md  ✅ RECOMMENDED
```

### Create Submission Archive (if needed)

```bash
# Create a clean build for submission
docker build -t chat-application:submission .

# Export image (if required)
docker save chat-application:submission -o chat-application-docker.tar

# Compress (optional)
gzip chat-application-docker.tar
```

## Troubleshooting

### Build Fails

```bash
# Clear Docker cache and rebuild
docker build --no-cache -t chat-application:v1.0.0 .

# Check Docker disk space
docker system df

# Clean up old images
docker system prune -a
```

### Container Won't Start

```bash
# Check logs for errors
docker logs chat-app-test

# Common issues:
# 1. MongoDB not accessible - check MONGO_DB_URI
# 2. Port already in use - change port mapping
# 3. Missing environment variables - check .env
```

### Health Check Fails

```bash
# Check if container is running
docker ps -a

# Check health status
docker inspect chat-app-test --format='{{.State.Health.Status}}'

# Manual health check
docker exec chat-app-test wget -q -O- http://localhost:5000/api/health
```

### MongoDB Connection Error

```bash
# If using docker-compose
docker-compose logs mongodb

# If using host MongoDB, use:
# - Linux/Mac: mongodb://host.docker.internal:27017/chat-app
# - Windows: mongodb://host.docker.internal:27017/chat-app
# - Docker network: mongodb://mongodb:27017/chat-app
```

## Verification Checklist

Before submitting, verify:

- [ ] ✅ Dockerfile exists and uses pinned base image
- [ ] ✅ Docker build completes successfully
- [ ] ✅ Image digest can be extracted
- [ ] ✅ Container starts without errors
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ Application is accessible at http://localhost:5000
- [ ] ✅ All environment variables are documented
- [ ] ✅ .dockerignore exists
- [ ] ✅ Documentation is complete (DOCKER.md, README.md)
- [ ] ✅ Repository attestation included

## Quick Commands Reference

```bash
# Build
docker build -t chat-application:v1.0.0 .

# Run with docker-compose
docker-compose up -d

# Get digest
docker inspect chat-application:v1.0.0 --format='{{.Id}}'

# Test health
curl http://localhost:5000/api/health

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Clean up everything
docker-compose down -v
docker rmi chat-application:v1.0.0
```

## Expected Build Output

```
[+] Building 120.5s (21/21) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 1.23kB
 => [internal] load .dockerignore
 => [builder 1/7] FROM node:20.12.2-alpine3.19
 => [builder 2/7] WORKDIR /app
 => [builder 3/7] COPY package.json package-lock.json* ./
 => [builder 4/7] RUN npm ci
 => [builder 5/7] COPY . .
 => [builder 6/7] RUN npm run build --prefix frontend
 => [stage-1 1/9] RUN apk update && apk upgrade --no-cache
 => [stage-1 2/9] RUN addgroup -g 1001 -S nodejs
 => [stage-1 3/9] WORKDIR /app
 => [stage-1 4/9] COPY package.json package-lock.json* ./
 => [stage-1 5/9] RUN npm ci --only=production
 => [stage-1 6/9] COPY --chown=nodejs:nodejs backend ./backend
 => [stage-1 7/9] COPY --chown=nodejs:nodejs --from=builder /app/frontend/dist
 => exporting to image
 => => exporting layers
 => => writing image sha256:abc123...
 => => naming to docker.io/library/chat-application:v1.0.0
```

## Support

If you encounter issues:

1. Check the [DOCKER.md](DOCKER.md) for detailed troubleshooting
2. Review [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) for requirements
3. Verify environment variables in `.env`
4. Check Docker logs: `docker logs [container-name]`

## Timeline

- **Build time**: 2-5 minutes (first build)
- **Rebuild time**: 30-60 seconds (with cache)
- **Container startup**: 5-10 seconds
- **Total preparation**: ~10 minutes

---

**You're ready to submit!** 🚀

Make sure both the project files and Dockerfile are included in your submission.
