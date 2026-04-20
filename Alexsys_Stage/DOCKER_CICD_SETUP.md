# Docker & CI/CD Setup Guide

This project includes a production-ready Docker setup and GitHub Actions CI/CD pipeline.

## 📋 Files Overview

### **Dockerfile**
Multi-stage Docker build with:
- **Build Stage**: Uses Node 18-alpine to build the Vite + React app
- **Production Stage**: Serves the built app using nginx
- **Health Checks**: Ensures container is running correctly
- **Security**: Minimal production image size

### **nginx.conf**
Nginx configuration optimized for:
- SPA routing (React Router support)
- Static asset caching
- Gzip compression
- Security headers
- Health check endpoint

### **CI/CD Pipelines**

#### Main Pipeline: `.github/workflows/ci-cd.yml`
Runs on every push and pull request to `main` and `develop`:

1. **Lint & Type Check**: ESLint + TypeScript verification
2. **Build**: Compiles the application
3. **Docker Build & Push**: Only runs on main branch pushes (optional)
4. **Security Scan**: Trivy vulnerability scanning
5. **Notify**: Reports workflow status

#### Docker Hub Pipeline: `.github/workflows/docker-hub.yml` (Optional)
Alternative simpler pipeline for Docker Hub deployments.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Build Locally
```bash
npm run build
npm run preview
```

### Build Docker Image
```bash
docker build -t alexsys-stage:latest .
docker run -p 80:8080 alexsys-stage:latest
```

Visit `http://localhost:8080`

## 🔧 Configuration

### Using GitHub Container Registry (Default)
No setup needed! The pipeline uses GitHub's built-in container registry.

### Using Docker Hub (Alternative)
Set these secrets in GitHub repository settings:
- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Docker Hub access token

To create a token:
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Copy the token

Then enable the Docker Hub workflow in `.github/workflows/docker-hub.yml`

## 📊 Pipeline Triggers

### CI Pipeline
- ✅ Runs on every push to `main` or `develop`
- ✅ Runs on every pull request to `main` or `develop`
- ✅ Docker build only on `main` branch merges

### Manual Trigger
To manually run a workflow:
1. Go to your GitHub repo → **Actions**
2. Select the workflow
3. Click **Run workflow**

## 🔍 Monitoring

### GitHub Actions Dashboard
- View logs for each job
- See artifacts (built dist folder)
- Check security scan results

### Build Artifacts
Each successful build uploads the `dist/` folder automatically.

## 🐳 Docker Commands

### Build
```bash
docker build -t alexsys-stage:v1.0.0 .
```

### Run
```bash
docker run -d -p 8080:80 --name my-app alexsys-stage:v1.0.0
```

### View Logs
```bash
docker logs -f my-app
```

### Stop Container
```bash
docker stop my-app
```

## 📈 Performance Optimizations

✅ Multi-stage builds reduce final image size  
✅ Nginx compression (gzip) enabled  
✅ Static asset caching (1 year)  
✅ Docker layer caching  
✅ Alpine Linux for minimal footprint  

## 🔐 Security Features

✅ Health checks  
✅ Trivy vulnerability scanning  
✅ Minimal base images  
✅ No privileged mode  
✅ Read-only file systems support  

## 🚨 Troubleshooting

### Pipeline Failing?
1. Check GitHub Actions logs
2. Ensure `package.json` scripts exist
3. Verify Node version compatibility

### Docker Build Failing?
1. Check Docker version: `docker --version`
2. Ensure sufficient disk space
3. Clean cache: `docker builder prune`

### Port Already in Use?
```bash
docker run -p 8081:80 alexsys-stage:latest
```

## 📝 Next Steps

1. Push changes to trigger CI/CD
2. Monitor GitHub Actions
3. Verify Docker image builds successfully
4. Deploy to your platform (Kubernetes, Docker Swarm, etc.)

## 📚 Resources

- [Vite Documentation](https://vite.dev)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Nginx Documentation](https://nginx.org/en/docs/)
