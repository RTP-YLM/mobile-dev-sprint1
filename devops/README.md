# DevOps Configuration - Sprint 1

Complete CI/CD Pipeline and Infrastructure setup for production-ready deployment.

## 📁 Structure

```
devops/
├── workflows/              # GitHub Actions CI/CD
│   ├── ci.yml             # PR checks (lint, test, build, security)
│   ├── deploy-staging.yml # Auto-deploy to staging
│   └── deploy-production.yml # Production deployment
│
├── docker/                # Docker configuration
│   ├── Dockerfile         # Production multi-stage build
│   ├── Dockerfile.dev     # Development with hot reload
│   ├── docker-compose.yml # Local development stack
│   ├── docker-compose.prod.yml # Production stack
│   └── .dockerignore      # Exclude unnecessary files
│
├── terraform/             # Infrastructure as Code
│   ├── main.tf           # Main infrastructure config
│   ├── user-data.sh      # Server initialization script
│   └── terraform.tfvars.example # Variable examples
│
└── docs/                  # Documentation
    ├── branch-strategy.md    # Git workflow & PR process
    ├── infrastructure-guide.md # IaC approach & resource estimation
    └── deployment-guide.md   # Step-by-step deployment
```

## 🚀 Quick Start

### 1. Local Development
```bash
# Start all services
cd devops/docker
docker-compose up -d

# With development tools (pgAdmin, Redis Commander)
docker-compose --profile tools up -d

# View logs
docker-compose logs -f app
```

**Access Points:**
- App: http://localhost:3000
- pgAdmin: http://localhost:5050 (admin@localhost.com / admin)
- Redis Commander: http://localhost:8081

### 2. GitHub Actions Setup
```bash
# Copy workflows to your repo
cp -r devops/workflows .github/workflows

# Configure secrets in GitHub:
# Settings → Secrets → Actions
```

Required secrets:
- `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_KEY`
- `PROD_HOST`, `PROD_USER`, `PROD_SSH_KEY`
- `SLACK_WEBHOOK` (optional)

### 3. Infrastructure Deployment

**Option A: Docker Compose (Simple)**
```bash
# On server
cd /opt/app
docker-compose -f docker-compose.prod.yml up -d
```

**Option B: Terraform (Recommended)**
```bash
cd devops/terraform
terraform init
terraform plan
terraform apply
```

## 📋 Workflows

### CI Pipeline (ci.yml)
Triggers on: PR to `main` or `develop`

**Jobs:**
1. ✅ **Lint** - ESLint + Prettier
2. ✅ **Test** - Unit & integration tests with coverage
3. ✅ **Build** - Docker image build
4. ✅ **Security** - npm audit + Trivy scan

### Staging Deployment (deploy-staging.yml)
Triggers on: Push to `develop`

**Steps:**
1. Build & push Docker image to GHCR
2. SSH to staging server
3. Pull latest image
4. Zero-downtime restart
5. Run database migrations
6. Health check
7. Slack notification

### Production Deployment (deploy-production.yml)
Triggers on: Push to `main` or manual dispatch

**Steps:**
1. Build & push production image
2. Create database backup
3. Zero-downtime deployment
4. Run migrations
5. Health check (30 attempts)
6. Auto-rollback on failure
7. Slack notification

## 🏗️ Infrastructure

### Environment Comparison

| Resource | Development | Staging | Production |
|----------|------------|---------|------------|
| **App Instances** | 1 | 1 | 2 |
| **CPU** | 1 core | 2 cores | 2 cores each |
| **Memory** | 1GB | 2GB | 4GB each |
| **Database** | Local | VPS | Managed (RDS/DO) |
| **Redis** | Local | VPS | Managed |
| **Load Balancer** | No | No | Yes |
| **SSL** | No | Let's Encrypt | Let's Encrypt |
| **Cost/month** | $0 | ~$15 | ~$150 |

### Resource Estimation Details
See [docs/infrastructure-guide.md](docs/infrastructure-guide.md) for:
- Detailed resource calculations
- Cost optimization tips
- Scaling recommendations
- IaC comparison (Terraform vs Pulumi vs Docker Compose)

## 🔐 Security

### Network Security
- VPC with private subnets
- Firewall rules (UFW/Security Groups)
- No public database access
- SSL/TLS everywhere (Let's Encrypt)

### Application Security
- Non-root Docker user
- Secrets management (environment variables)
- Rate limiting
- CORS configuration
- Health checks

### Automated Security
- npm audit in CI
- Trivy container scanning
- Dependabot updates
- Automated security patches (unattended-upgrades)

## 🌿 Branch Strategy

```
main (production)
  ├── develop (staging)
  │   ├── feature/user-auth
  │   ├── feature/payment
  │   └── bugfix/login-error
  └── hotfix/critical-fix
```

**Flow:**
1. **Feature** → PR to `develop` → Auto-deploy to staging
2. **Develop** → PR to `main` (2 approvals) → Auto-deploy to production
3. **Hotfix** → PR to `main` → Emergency deploy

See [docs/branch-strategy.md](docs/branch-strategy.md) for full details.

## 📊 Monitoring

### Application Logs
```bash
# Real-time logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Health Checks
- Endpoint: `GET /health`
- Interval: 30s
- Timeout: 3s
- Retries: 3

### Recommended Tools
- **Uptime**: UptimeRobot / Pingdom
- **Logs**: Papertrail / CloudWatch
- **Errors**: Sentry
- **APM**: New Relic / DataDog

## 🔄 Common Commands

### Docker
```bash
# Rebuild and restart
docker-compose up -d --build

# View resource usage
docker stats

# Clean up
docker system prune -a

# Shell into container
docker-compose exec app sh
```

### Database
```bash
# Run migrations
docker-compose exec app npm run db:migrate

# Create backup
docker-compose exec postgres pg_dump -U postgres app_db | gzip > backup.sql.gz

# Restore backup
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U postgres app_db
```

### Terraform
```bash
# Preview changes
terraform plan

# Apply changes
terraform apply

# Show outputs
terraform output

# Destroy infrastructure
terraform destroy
```

## 📖 Documentation

- **[Branch Strategy](docs/branch-strategy.md)** - Git workflow, PR process, commit conventions
- **[Infrastructure Guide](docs/infrastructure-guide.md)** - IaC comparison, resource estimation, cost optimization
- **[Deployment Guide](docs/deployment-guide.md)** - Step-by-step deployment, troubleshooting

## 🎯 Sprint 1 Deliverables

✅ CI/CD Pipeline (GitHub Actions)
✅ Branch Strategy (GitHub Flow + environment branches)
✅ Docker Setup (multi-stage builds + compose)
✅ Local Development Environment
✅ Staging Environment Configuration
✅ Production Environment Template
✅ Infrastructure as Code (Terraform + Docker Compose)
✅ Deployment Documentation
✅ Security Best Practices

## 🚦 Next Steps (Post-Sprint 1)

1. **Monitoring & Alerting**
   - Set up Sentry for error tracking
   - Configure uptime monitoring
   - Add Slack/email alerts

2. **Performance**
   - Implement CDN (Cloudflare)
   - Add Redis caching layer
   - Database query optimization

3. **Advanced CI/CD**
   - Canary deployments
   - A/B testing infrastructure
   - Performance regression tests

4. **Scaling**
   - Auto-scaling policies
   - Multi-region deployment
   - Database replication

## 📞 Support

For questions or issues:
1. Check [docs/deployment-guide.md](docs/deployment-guide.md) troubleshooting section
2. Review GitHub Actions logs
3. Check Docker logs: `docker-compose logs -f`

---

**Built for Sprint 1** | Ready for production | Scalable architecture
