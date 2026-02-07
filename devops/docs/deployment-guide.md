# Deployment Guide

## Quick Start

### 1. Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd <project-name>

# Copy environment file
cp .env.example .env

# Start services with Docker Compose
cd devops/docker
docker-compose up -d

# View logs
docker-compose logs -f app

# Access services:
# - App: http://localhost:3000
# - pgAdmin: http://localhost:5050
# - Redis Commander: http://localhost:8081 (with --profile tools)
```

### 2. Run Development Tools

```bash
# Start with pgAdmin and Redis Commander
docker-compose --profile tools up -d

# Start only main services
docker-compose up -d app postgres redis
```

### 3. Database Migrations

```bash
# Run migrations
docker-compose exec app npm run db:migrate

# Rollback migration
docker-compose exec app npm run db:rollback

# Seed database
docker-compose exec app npm run db:seed
```

---

## CI/CD Setup

### 1. GitHub Repository Setup

```bash
# Copy workflows to your repository
cp -r devops/workflows .github/workflows

# Commit and push
git add .github/workflows
git commit -m "chore: add CI/CD workflows"
git push origin develop
```

### 2. Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

#### Staging Secrets
```
STAGING_HOST=staging.yourapp.com
STAGING_USER=deploy
STAGING_SSH_KEY=<your-private-key>
STAGING_URL=https://staging.yourapp.com
```

#### Production Secrets
```
PROD_HOST=app.yourapp.com
PROD_USER=deploy
PROD_SSH_KEY=<your-private-key>
PROD_URL=https://yourapp.com
GITHUB_TOKEN=<automatic>
```

#### Optional
```
SLACK_WEBHOOK=<your-slack-webhook-url>
CODECOV_TOKEN=<your-codecov-token>
```

### 3. Enable Branch Protection

**For `main` branch:**
1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews before merging (2 approvals)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution
   - ✅ Do not allow bypassing the above settings
   - ✅ Restrict who can push (admins only)

**For `develop` branch:**
- Same as above but require only 1 approval

---

## Server Setup (Staging/Production)

### 1. Provision Server

**Option A: Using Terraform**
```bash
cd devops/terraform

# Copy variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# Get outputs
terraform output -json > outputs.json
```

**Option B: Manual (DigitalOcean/AWS/etc.)**
1. Create a droplet/instance with Docker pre-installed
2. Minimum: 2 CPU, 2GB RAM, 50GB storage
3. Add SSH key for deployment

### 2. Server Initial Setup

```bash
# SSH into server
ssh deploy@your-server-ip

# Create app directory
sudo mkdir -p /opt/app
sudo chown $USER:$USER /opt/app

# Install Docker Compose (if not installed)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone production docker-compose
cd /opt/app
git clone <your-repo> .
cp devops/docker/docker-compose.prod.yml docker-compose.yml
```

### 3. Configure Environment Variables

```bash
# Create .env.production
cat > /opt/app/.env.production << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@postgres:5432/app_prod
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -hex 32)
POSTGRES_USER=app_user
POSTGRES_PASSWORD=$(openssl rand -hex 16)
POSTGRES_DB=app_prod
REDIS_PASSWORD=$(openssl rand -hex 16)
EOF

# Secure the file
chmod 600 /opt/app/.env.production
```

### 4. Start Services

```bash
cd /opt/app
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec app npm run db:migrate
```

---

## Deployment Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Develop
# ... make changes ...

# 3. Commit
git add .
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/my-feature

# 5. PR will trigger CI:
#    - Lint check
#    - Unit tests
#    - Build check
#    - Security scan
```

### Deploy to Staging
```bash
# 1. Merge PR to develop
# 2. GitHub Actions automatically:
#    - Builds Docker image
#    - Pushes to GHCR
#    - SSH to staging server
#    - Pulls latest image
#    - Restarts services
#    - Runs migrations
#    - Health check
```

### Deploy to Production
```bash
# 1. Create PR: develop → main
# 2. Get 2 approvals
# 3. Merge PR
# 4. GitHub Actions automatically:
#    - Builds production image
#    - Creates database backup
#    - Zero-downtime deployment
#    - Runs migrations
#    - Health check
#    - Rollback on failure
#    - Slack notification
```

---

## Manual Deployment (Fallback)

### Build and Push Image
```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Build image
docker build -t ghcr.io/username/repo:latest -f devops/docker/Dockerfile .

# Push image
docker push ghcr.io/username/repo:latest
```

### Deploy to Server
```bash
# SSH to server
ssh deploy@your-server

# Pull latest
cd /opt/app
docker-compose pull

# Restart services
docker-compose up -d --remove-orphans

# Run migrations
docker-compose exec app npm run db:migrate

# Check health
curl http://localhost:3000/health
```

---

## Rollback

### Automatic Rollback
If health check fails, GitHub Actions automatically rolls back to the previous version.

### Manual Rollback
```bash
# SSH to server
ssh deploy@your-server

# Find previous image
docker images | grep app

# Update docker-compose.yml with previous tag
vim docker-compose.yml
# Change image: ghcr.io/user/repo:latest
# To: image: ghcr.io/user/repo:previous-sha

# Restart
docker-compose up -d

# Restore database (if needed)
gunzip < /backup/db-TIMESTAMP.sql.gz | docker-compose exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB
```

---

## Monitoring & Logs

### View Application Logs
```bash
# Real-time logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# All services
docker-compose logs -f
```

### Database Backup
```bash
# Manual backup
docker-compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore
gunzip < backup-YYYYMMDD.sql.gz | docker-compose exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB
```

### System Health
```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Check service status
docker-compose ps
```

---

## Troubleshooting

### App won't start
```bash
# Check logs
docker-compose logs app

# Check environment
docker-compose exec app env

# Rebuild and restart
docker-compose up -d --build app
```

### Database connection issues
```bash
# Test connection
docker-compose exec app npm run db:ping

# Check database is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

### Out of memory
```bash
# Check memory usage
docker stats

# Increase swap (temporary fix)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Long-term: upgrade server resources
```

### Disk space full
```bash
# Clean up Docker
docker system prune -a --volumes

# Clean old logs
sudo journalctl --vacuum-time=7d

# Clean old backups
find /backup -mtime +30 -delete
```
