# Deployment Guide

This guide provides comprehensive instructions for deploying hianime-api using Docker, Render, and other platforms.

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
  - [Auto-Deploy Configuration](#auto-deploy-configuration)
- [Replit Deployment](#replit-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Troubleshooting](#troubleshooting)
- [Health Checks](#health-checks)
- [Production Best Practices](#production-best-practices)

---

## Docker Deployment

### Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (optional, for easier management)
- Git (for cloning the repository)

### Building the Docker Image

1. **Clone the repository:**
```bash
git clone https://github.com/ryanwtf88/hianime-api.git
cd hianime-api
```

2. **Build the Docker image:**
```bash
docker build -t hianime-api .
```

3. **Verify the image was created:**
```bash
docker images | grep hianime-api
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

**With detached mode (runs in background):**
```bash
docker run -d -p 3030:3030 --name hianime-api-container hianime-api
```

**With custom port:**
```bash
docker run -p 8080:3030 -e PORT=3030 hianime-api
```

**With restart policy:**
```bash
docker run -d -p 3030:3030 --restart unless-stopped --name hianime-api-container hianime-api
```

### Container Management Commands

**View logs:**
```bash
# Follow logs in real-time
docker logs -f hianime-api-container

# View last 100 lines
docker logs --tail 100 hianime-api-container
```

**Check container status:**
```bash
docker ps -a | grep hianime-api
```

**Stop the container:**
```bash
docker stop hianime-api-container
```

**Start a stopped container:**
```bash
docker start hianime-api-container
```

**Restart the container:**
```bash
docker restart hianime-api-container
```

**Remove the container:**
```bash
docker rm hianime-api-container
```

**Remove the image:**
```bash
docker rmi hianime-api
```

### Docker Compose

Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    container_name: hianime-api
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
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Docker Compose commands:**

```bash
# Start the service in detached mode
docker-compose up -d

# Start and rebuild the image
docker-compose up -d --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f hianime-api

# Stop the service
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart the service
docker-compose restart

# Check service status
docker-compose ps
```

### Docker with Environment File

Create a `.env` file:

```env
NODE_ENV=production
PORT=3030
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    container_name: hianime-api
    ports:
      - "${PORT:-3030}:3030"
    env_file:
      - .env
    restart: unless-stopped
```

Then run:

```bash
docker-compose --env-file .env up -d
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
   - Select the repository: `ryanwtf88/hianime-api`

3. **Configure the service:**
   - **Name**: `hianime-api` (or your preferred name)
   - **Region**: Choose your preferred region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `master` ⚠️ **Important: Use master, not main**
   - **Root Directory**: Leave empty (uses root)
   - **Runtime**: Docker
   - **Docker Command**: Leave empty (uses CMD from Dockerfile)
   - **Docker Context Directory**: Leave empty
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: 
     - Free (for testing, with limitations)
     - Starter ($7/month, recommended for production)
     - Standard or higher (for high traffic)

4. **Add environment variables** (see below)

5. **Deploy**: Click "Create Web Service"

6. **Wait for deployment**: First deployment takes 3-5 minutes

### Environment Variables

Add these environment variables in the Render dashboard:

| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `NODE_ENV` | `production` | Yes | Sets the application environment |
| `PORT` | `3030` | Yes | Port the application listens on |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL | Optional* | Redis connection URL for caching |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token | Optional* | Redis authentication token |

*Required if you're using Redis for caching

**To add environment variables:**
1. Go to your service in Render Dashboard
2. Navigate to "Environment" tab
3. Click "Add Environment Variable"
4. Enter the key and value
5. Click "Save Changes" (will trigger a redeploy)

### Auto-Deploy Configuration

The `render.yaml` file in the repository root configures automatic deployment:

```yaml
services:
  - type: web
    name: hianime-api
    env: docker
    branch: master  # Deploys from master branch
    dockerfilePath: ./Dockerfile
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3030
```

**Auto-deploy triggers when you push changes to the `master` branch affecting:**
- Any `.js`, `.ts`, `.jsx`, `.tsx` files
- `package.json`
- `bun.lockb`
- `Dockerfile`
- `render.yaml`

**To disable auto-deploy:**
1. Go to service settings in Render Dashboard
2. Navigate to "Settings" tab
3. Find "Auto-Deploy" section
4. Toggle off "Auto-Deploy"

### Render-Specific Tips

**Check deployment status:**
- View logs in real-time from the "Logs" tab
- Monitor deployment progress in the "Events" tab

**Custom domain:**
1. Go to "Settings" tab
2. Scroll to "Custom Domain"
3. Click "Add Custom Domain"
4. Follow DNS configuration instructions

**Health checks:**
- Render automatically performs health checks on the root path `/`
- Configure custom health check path in "Settings" → "Health Check Path"

**Persistent storage:**
- Free tier restarts periodically and doesn't persist data
- Use external services (Redis, databases) for persistent data

---

## Replit Deployment

Replit provides an easy way to deploy and test the API.

### Steps:

1. **Import repository:**
   - Go to [Replit](https://replit.com/)
   - Click "Create" → "Import from GitHub"
   - Enter repository URL: `https://github.com/ryanwtf88/hianime-api`
   - Click "Import from GitHub"

2. **Configure:**
   - Replit should auto-detect Bun runtime
   - If not, create/update `.replit` file:
   ```toml
   run = "bun run start"
   
   [nix]
   channel = "stable-22_11"
   
   [deployment]
   run = ["sh", "-c", "bun run start"]
   ```

3. **Add environment variables:**
   - Click "Secrets" (🔒 icon in left sidebar)
   - Add variables:
     - `NODE_ENV=production`
     - `PORT=3030`

4. **Run the application:**
   - Click the "Run" button
   - Replit will install dependencies and start the server

5. **Access your API:**
   - Use the provided Replit URL (e.g., `https://hianime-api.username.repl.co`)

### Replit Limitations:

- Free tier has limited uptime
- May go to sleep after inactivity
- Limited CPU and memory resources
- Better suited for development/testing than production

---

## Vercel Deployment

While Vercel is optimized for frontend, you can deploy the API with some configuration.

### Steps:

1. **Fork the repository** to your GitHub account

2. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

3. **Create `vercel.json`** in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

4. **Deploy:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your forked repository
   - Configure environment variables
   - Deploy

**Note:** Vercel has limitations on execution time and may not be ideal for all use cases. Consider Render or Railway for better API hosting.

---

## Railway Deployment

Railway offers excellent support for Dockerized applications.

### Steps:

1. **Create account** at [Railway](https://railway.app/)

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select the `hianime-api` repository

3. **Configure:**
   - Railway auto-detects Dockerfile
   - Add environment variables in the Variables tab:
     - `NODE_ENV=production`
     - `PORT=3030`

4. **Deploy:**
   - Railway automatically builds and deploys
   - You'll get a URL like `https://hianime-api.up.railway.app`

5. **Custom domain** (optional):
   - Go to Settings
   - Click "Generate Domain" or add custom domain

### Railway Benefits:

- Generous free tier ($5 credit/month)
- Excellent Docker support
- Simple deployment process
- Built-in monitoring and logs
- Easy scaling

---

## Troubleshooting

### Docker Issues

**Container exits immediately:**
```bash
# Check logs for errors
docker logs hianime-api-container

# Check if port is available
lsof -i :3030  # macOS/Linux
netstat -ano | findstr :3030  # Windows
```

**Port already in use:**
```bash
# Use a different host port
docker run -p 3031:3030 hianime-api

# Or kill the process using the port
kill -9 $(lsof -ti:3030)  # macOS/Linux
```

**Cannot connect to Docker daemon:**
```bash
# Linux - Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# macOS/Windows - Restart Docker Desktop
# Open Docker Desktop and restart from menu
```

**Permission denied errors:**
```bash
# Linux - Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo
sudo docker run -p 3030:3030 hianime-api
```

**Build fails with dependency errors:**
```bash
# Clear Docker cache and rebuild
docker build --no-cache -t hianime-api .

# Check Dockerfile syntax
docker build --progress=plain -t hianime-api .
```

**Container runs but API not accessible:**
```bash
# Check container is running
docker ps

# Check container logs
docker logs hianime-api-container

# Test from inside container
docker exec -it hianime-api-container curl http://localhost:3030

# Check firewall settings
sudo ufw status  # Linux
```

### Render Issues

**Build fails:**
- Verify `Dockerfile` is in the root directory
- Check all dependencies are listed in `package.json`
- Review build logs in Render dashboard under "Logs" tab
- Ensure branch is set to `master` not `main`
- Check if Dockerfile syntax is correct

**Application crashes on startup:**
- Check application logs in "Logs" tab
- Verify all required environment variables are set
- Ensure `PORT` environment variable is set to `3030`
- Check if health check endpoint returns 200 OK
- Review memory usage (upgrade instance if needed)

**Slow response times:**
- Consider upgrading from Free tier to Starter ($7/month)
- Free tier has limited CPU and RAM
- Implement Redis caching with Upstash
- Monitor resource usage in dashboard
- Check if external API (hianime.to) is slow

**Deploy not triggering:**
- Verify `render.yaml` branch is set to `master`
- Check if auto-deploy is enabled in settings
- Manually trigger deploy from dashboard
- Ensure you're pushing to the correct branch

**"Service Unavailable" errors:**
- Check if free tier instance is sleeping (takes ~30s to wake)
- Verify health check endpoint is working
- Check application logs for errors
- Ensure PORT matches in code and environment variables

### Replit Issues

**Dependencies not installing:**
- Delete `.replit` and `replit.nix` files
- Click "Shell" and run `bun install` manually
- Restart the Repl

**Port binding errors:**
- Ensure `PORT` is set correctly in secrets
- Replit auto-assigns a port; make sure your app listens on `0.0.0.0`

**Repl keeps sleeping:**
- Free Repls sleep after inactivity
- Upgrade to Hacker plan for always-on
- Use UptimeRobot or similar to ping your Repl periodically

### General Issues

**API not responding:**
1. Check if the service is running
2. Verify the correct port is exposed and accessible
3. Check firewall/security group settings
4. Review application logs for errors
5. Test health check endpoint: `curl http://localhost:3030/`
6. Verify DNS and SSL certificates (for custom domains)

**Memory issues:**
- Increase Docker container memory limit:
  ```bash
  docker run -m 512m -p 3030:3030 hianime-api
  ```
- Upgrade Render instance type
- Optimize code and implement proper caching
- Monitor memory usage with `docker stats`

**Rate limiting from hianime.to:**
- Implement request caching with Redis
- Add delays between requests
- Use multiple instances with load balancing
- Respect robots.txt and rate limits

**CORS errors:**
- Add proper CORS headers in your application
- Configure allowed origins in environment variables
- Use a reverse proxy with proper CORS configuration

**SSL/HTTPS issues:**
- Render provides automatic HTTPS
- For custom domains, verify DNS settings
- Check SSL certificate status in dashboard

---

## Health Checks

The API includes a health check endpoint for monitoring.

### Health Check Endpoint

**GET** `/`

**Response:**
```json
{
  "success": true,
  "message": "Welcome to HiAnime API",
  "version": "1.0.0",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "status": "ok"
}
```

### Docker Health Check

The Dockerfile includes an automatic health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD curl -f http://localhost:3030/ || exit 1
```

**Parameters:**
- `interval`: Check every 30 seconds
- `timeout`: Wait max 10 seconds for response
- `retries`: Mark unhealthy after 3 failed checks
- `start-period`: Grace period of 40 seconds during startup

**Check container health status:**
```bash
docker inspect --format='{{.State.Health.Status}}' hianime-api-container
```

### Render Health Check

Render automatically performs health checks:
- Path: `/` (root endpoint)
- Interval: Every 30 seconds
- Timeout: 10 seconds
- Unhealthy threshold: 3 consecutive failures

**Custom health check path:**
1. Go to service Settings in Render Dashboard
2. Navigate to "Health Check Path"
3. Enter your custom path (e.g., `/health`)
4. Save changes

### Monitoring Tools

**UptimeRobot** - Free monitoring:
1. Sign up at [UptimeRobot](https://uptimerobot.com/)
2. Add new monitor
3. Enter your API URL
4. Set check interval (5 minutes on free plan)
5. Configure email/SMS alerts

**Healthchecks.io** - Cron monitoring:
1. Create account at [Healthchecks.io](https://healthchecks.io/)
2. Create new check
3. Use the provided URL to ping from your app
4. Get alerts if pings stop

---

## Production Best Practices

### 1. Environment Variables
- Never commit sensitive data to repository
- Use `.env` files locally (add to `.gitignore`)
- Store secrets in platform secret managers
- Rotate credentials regularly

### 2. Security
- **Enable CORS** appropriately for your use case:
  ```javascript
  // Allow specific origins
  const allowedOrigins = ['https://yourdomain.com'];
  ```
- **Implement rate limiting** to prevent abuse:
  ```javascript
  // Example: 100 requests per 15 minutes per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  ```
- Use HTTPS only (enforced by Render/Railway)
- Validate and sanitize all inputs
- Keep dependencies updated

### 3. Monitoring & Logging
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Enable application logging:
  ```javascript
  console.log('[INFO]', timestamp, message);
  console.error('[ERROR]', timestamp, error);
  ```
- Monitor error rates and response times
- Set up alerts for downtime or errors
- Use structured logging (JSON format)

### 4. Caching Strategy
- Implement Redis caching with Upstash
- Cache frequently requested data
- Set appropriate TTL (Time To Live) values
- Use cache-control headers:
  ```javascript
  res.setHeader('Cache-Control', 'public, max-age=3600');
  ```

### 5. Performance Optimization
- Use CDN for static assets (if applicable)
- Enable gzip compression
- Optimize database queries
- Implement pagination for large datasets
- Use connection pooling

### 6. Backup & Recovery
- Regularly backup configurations
- Document deployment process
- Keep infrastructure as code (Docker files, YAML configs)
- Test disaster recovery procedures
- Version control everything

### 7. Scaling
- **Horizontal scaling**: Add more instances
- **Vertical scaling**: Upgrade instance size
- Use load balancing for multiple instances
- Implement request queuing for high traffic
- Consider serverless for variable traffic

### 8. Updates & Maintenance
- Keep dependencies updated:
  ```bash
  bun update
  ```
- Monitor security advisories
- Schedule regular maintenance windows
- Test updates in staging before production
- Use semantic versioning

### 9. Cost Optimization
- Start with free/cheap tiers
- Monitor resource usage
- Scale only when needed
- Use caching to reduce API calls
- Implement request coalescing

### 10. Documentation
- Keep API documentation up-to-date
- Document deployment procedures
- Maintain changelog
- Create runbooks for common issues
- Share knowledge with team

---

## Additional Resources

### Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Bun Documentation](https://bun.sh/docs)
- [Replit Documentation](https://docs.replit.com/)

### Project Resources
- [GitHub Repository](https://github.com/ryanwtf88/hianime-api)
- [Issues Tracker](https://github.com/ryanwtf88/hianime-api/issues)
- [API Documentation](https://github.com/ryanwtf88/hianime-api#documentation)
- [Contributing Guidelines](https://github.com/ryanwtf88/hianime-api/blob/master/CONTRIBUTING.md)

### Community & Support
- [GitHub Discussions](https://github.com/ryanwtf88/hianime-api/discussions)
- [Report Bug](https://github.com/ryanwtf88/hianime-api/issues/new)
- [Request Feature](https://github.com/ryanwtf88/hianime-api/issues/new)

### Learning Resources
- [Docker Tutorial](https://docker-curriculum.com/)
- [Bun Getting Started](https://bun.sh/docs/installation)
- [REST API Best Practices](https://restfulapi.net/)
- [Production Deployment Checklist](https://github.com/mtdvio/going-to-production)

---

## Need Help?

If you encounter any issues:

1. **Check this deployment guide** thoroughly
2. **Review the [troubleshooting section](#troubleshooting)** for common issues
3. **Search [existing issues](https://github.com/ryanwtf88/hianime-api/issues)** - someone may have faced the same problem
4. **Check application logs** - most issues leave traces in logs
5. **Create a new issue** with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Environment details (OS, Docker version, etc.)
   - What you've already tried

**When reporting issues, include:**
- Deployment method (Docker, Render, etc.)
- Error messages (full stack trace if available)
- Environment (OS, versions)
- Steps you've already taken
- Relevant configuration files (sanitize sensitive data)

---

<div align="center">

**Happy Deploying! 🚀**

Made with ❤️ by RY4N

</div>
