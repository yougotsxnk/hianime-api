# Deployment Guide

This guide provides instructions for deploying hianime-api using Docker and Render.

## Table of Contents

- [Docker Deployment](#docker-deployment)
  - [Prerequisites](#prerequisites)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Container](#running-the-container)
  - [Docker Compose](#docker-compose)
- [Render Deployment](#render-deployment)
  - [One-Click Deploy](#one-click-deploy)
  - [Manual Deployment](#manual-deployment)
  - [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Docker Deployment

### Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (optional, for easier management)

### Building the Docker Image

1. Clone the repository:
```bash
git clone https://github.com/ryanwtf88/hianime-api.git
cd hianime-api
```

2. Build the Docker image:
```bash
docker build -t hianime-api .
```

### Running the Container

**Basic run:**
```bash
docker run -p 3030:3030 hianime-api
```

**With environment variables:**
```bash
docker run -p 3030:3030 \
  -e NODE_ENV=production \
  -e PORT=3030 \
  hianime-api
```

**With detached mode:**
```bash
docker run -d -p 3030:3030 --name hianime-api-container hianime-api
```

**View logs:**
```bash
docker logs hianime-api-container
```

**Stop the container:**
```bash
docker stop hianime-api-container
```

**Remove the container:**
```bash
docker rm hianime-api-container
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=production
      - PORT=3030
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Run with Docker Compose:**
```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

---

## Render Deployment

### One-Click Deploy

Click the button below to deploy directly to Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ryanwtf88/hianime-api)

### Manual Deployment

1. **Fork or clone the repository** to your GitHub account

2. **Create a new Web Service** on Render:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service:**
   - **Name**: `hianime-api` (or your preferred name)
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Docker Command**: Leave empty (uses CMD from Dockerfile)
   - **Instance Type**: Free or paid plan

4. **Add environment variables** (see below)

5. **Deploy**: Click "Create Web Service"

### Environment Variables

Add these environment variables in the Render dashboard:

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3030` | Yes |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL | Optional* |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token | Optional* |

*Required if you're using Redis for caching

**To add environment variables:**
1. Go to your service in Render Dashboard
2. Navigate to "Environment" tab
3. Click "Add Environment Variable"
4. Add each variable and click "Save Changes"

### Auto-Deploy

The `render.yaml` file is configured to automatically deploy when you push changes to the `main` branch affecting:
- JavaScript/TypeScript files
- package.json
- bun.lockb
- Dockerfile

---

## Troubleshooting

### Docker Issues

**Container exits immediately:**
```bash
# Check logs for errors
docker logs hianime-api-container
```

**Port already in use:**
```bash
# Use a different port
docker run -p 3031:3030 hianime-api
```

**Cannot connect to Docker daemon:**
```bash
# Start Docker service
sudo systemctl start docker  # Linux
# or restart Docker Desktop on Windows/Mac
```

### Render Issues

**Build fails:**
- Check that `Dockerfile` is in the root directory
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

**Application crashes:**
- Check application logs in Render dashboard
- Verify environment variables are set correctly
- Ensure PORT is set to 3030

**Slow response times:**
- Consider upgrading from Free tier
- Check if you need to implement caching
- Monitor resource usage in dashboard

### General Issues

**API not responding:**
1. Check if the service is running
2. Verify the correct port is exposed
3. Check firewall settings
4. Review application logs

**Memory issues:**
- Increase Docker container memory limit
- Upgrade Render instance type
- Optimize caching strategy

---

## Health Checks

The API includes a health check endpoint at `/` that returns:

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Docker Health Check

The Dockerfile includes a health check that runs every 30 seconds:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3030/ || exit 1
```

### Render Health Check

Render automatically performs health checks on the root path `/`.

---

## Production Best Practices

1. **Use environment variables** for all configuration
2. **Enable CORS** appropriately for your use case
3. **Implement rate limiting** to prevent abuse
4. **Set up monitoring** and alerting
5. **Use a CDN** for static assets if applicable
6. **Enable logging** for debugging
7. **Regular updates** - keep dependencies updated
8. **Backup strategy** if using persistent storage

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Render Documentation](https://render.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Project Issues](https://github.com/ryanwtf88/hianime-api/issues)

---

**Need Help?**

If you encounter any issues, please:
1. Check this deployment guide
2. Review the [troubleshooting section](#troubleshooting)
3. Search [existing issues](https://github.com/ryanwtf88/hianime-api/issues)
4. Create a new issue with detailed information
