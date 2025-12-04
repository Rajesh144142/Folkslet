# Docker Setup for Folkslet

## Prerequisites
- Docker
- Docker Compose

## Quick Start

### Production
```bash
docker-compose up -d
```

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

## Services

- **MongoDB**: Database on port 27017
- **Server**: API server on port 5000
- **Socket**: WebSocket server on port 8800
- **Client**: Frontend on port 80

## Environment Variables

### Setup .env File

1. Create a `.env` file in the root directory (same level as `docker-compose.yml`)
2. Copy from `Server/env.example` or use this template:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database (automatically set for Docker)
MONGO_URI=mongodb://mongodb:27017/folkslet

# Authentication
JWTKEY=your-strong-secret-key-here
JWT_EXPIRES_IN=1h

# CORS
CLIENT_ORIGINS=http://localhost:5173,http://localhost:80

# Cloudinary (Required for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=folkslet

# Socket Configuration
SOCKET_PORT=8800
SOCKET_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80
SOCKET_PING_TIMEOUT=25000
SOCKET_PING_INTERVAL=20000

# Optional Settings
REQUEST_LIMIT=30mb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
LOG_LEVEL=INFO
TZ=UTC
```

**Note**: The `.env` file is automatically loaded by docker-compose. Make sure it's in `.gitignore` (already configured).

## Commands

### Build images
```bash
docker-compose build
```

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

### Clean up
```bash
docker-compose down -v
```

