# Infrastructure Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Internet                           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Load Balancer / CDN                     │
│              (Cloudflare / AWS ALB)                      │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐         ┌──────────▼─────────┐
│   Production   │         │      Staging       │
│  Environment   │         │    Environment     │
└───────┬────────┘         └──────────┬─────────┘
        │                             │
   ┌────┴────┐                   ┌────┴────┐
   │ App (x2)│                   │ App (x1)│
   ├─────────┤                   ├─────────┤
   │ Postgres│                   │ Postgres│
   ├─────────┤                   ├─────────┤
   │  Redis  │                   │  Redis  │
   └─────────┘                   └─────────┘
```

## Infrastructure as Code Approach

### Recommended: **Terraform** (Best for Sprint 1)

**Pros:**
- Industry standard
- Great provider ecosystem (AWS, GCP, Azure, DigitalOcean)
- Declarative and easy to learn
- Large community
- Free and open source

**Cons:**
- State management complexity
- HCL syntax (learning curve)

**Use Terraform if:**
- You want production-ready IaC
- Team has basic DevOps knowledge
- Planning to scale to cloud providers

---

### Alternative: **Docker Compose** (Fastest for MVP)

**Pros:**
- Simplest setup
- Great for small teams
- Works on any VPS
- No state management
- Easy to understand

**Cons:**
- Not true IaC
- Limited to single-host deployments
- Manual scaling

**Use Docker Compose if:**
- MVP/early stage
- Budget-constrained
- Single server deployment
- Team is small (1-3 devs)

---

### Alternative: **Pulumi** (Modern IaC)

**Pros:**
- Write in TypeScript/Python/Go
- Great for developers who dislike HCL
- Better testing capabilities
- Native programming language features

**Cons:**
- Smaller community
- Commercial product (free tier available)
- Newer, less mature

**Use Pulumi if:**
- Team prefers code over config
- Need complex logic in infrastructure
- TypeScript expertise

---

## Sprint 1 Recommendation: **Docker Compose + Basic Terraform**

### Phase 1 (Week 1-2): Docker Compose
- Get app running locally and on staging VPS
- Focus on application development
- Manual deployment is acceptable

### Phase 2 (Week 3-4): Basic Terraform
- Define infrastructure for production
- Automate server provisioning
- Set up proper networking and security

### Phase 3 (Post-Sprint 1): Advanced IaC
- Multi-region setup
- Auto-scaling
- Advanced monitoring

---

## Resource Estimation

### Development Environment (Local)
```yaml
Backend:
  CPU: 1 core
  Memory: 1GB
  Storage: 10GB

PostgreSQL:
  CPU: 1 core
  Memory: 512MB
  Storage: 5GB

Redis:
  CPU: 0.5 core
  Memory: 256MB
  Storage: 1GB

Total: 2.5 cores, 1.8GB RAM, 16GB storage
```

### Staging Environment (VPS)
```yaml
Server: DigitalOcean Droplet / AWS EC2 t3.small
  CPU: 2 cores
  Memory: 2GB
  Storage: 50GB SSD
  Network: 2TB transfer

Monthly Cost: ~$12-18/month

Services:
  - App (Docker): 1GB RAM
  - PostgreSQL: 512MB RAM
  - Redis: 256MB RAM
  - Nginx: 128MB RAM
  - OS + Buffer: 128MB RAM
```

### Production Environment (Initial)
```yaml
Application Servers (2x):
  Instance: AWS EC2 t3.medium / DigitalOcean Droplet
  CPU: 2 cores each
  Memory: 4GB each
  Storage: 50GB SSD each

Database Server (1x):
  Instance: AWS RDS t3.small / DigitalOcean Managed DB
  CPU: 2 cores
  Memory: 2GB
  Storage: 100GB SSD (with auto-scaling)

Cache Server (1x):
  Instance: AWS ElastiCache / DigitalOcean Redis
  Memory: 1GB
  Eviction: LRU

Load Balancer:
  AWS ALB / DigitalOcean Load Balancer
  
CDN:
  Cloudflare (Free tier)

Total Monthly Cost: ~$100-150/month
```

### Production Environment (Scaled - 6 months)
```yaml
Application Servers (4x):
  Instance: t3.medium
  CPU: 2 cores each
  Memory: 4GB each
  Auto-scaling: 2-8 instances

Database:
  Instance: RDS t3.large
  CPU: 2 cores
  Memory: 8GB
  Storage: 500GB SSD
  Multi-AZ: Yes (for HA)

Cache:
  Instance: ElastiCache r6g.large
  Memory: 8GB
  Replication: Yes

Total Monthly Cost: ~$400-600/month
```

## Cost Optimization Tips

1. **Start Small**: Begin with staging-level resources for production
2. **Monitor**: Use CloudWatch/DataDog to track actual usage
3. **Reserved Instances**: Save 30-40% with 1-year commitments (after validation)
4. **Spot Instances**: Use for non-critical workloads (CI/CD runners)
5. **CDN**: Offload static assets to reduce server load
6. **Database**: Use connection pooling to reduce DB instance size
7. **Auto-scaling**: Scale down during off-peak hours

## Security Essentials

### Network
- VPC with private subnets
- Security groups (whitelist only)
- No public database access
- SSL/TLS everywhere

### Application
- Secrets management (AWS Secrets Manager / HashiCorp Vault)
- Environment variables (never hardcode)
- Rate limiting
- CORS configuration

### Monitoring
- Uptime monitoring (UptimeRobot / Pingdom)
- Log aggregation (CloudWatch / Papertrail)
- Error tracking (Sentry)
- Performance monitoring (New Relic / DataDog)

## Deployment Strategy

### Blue-Green Deployment
- Run two identical environments (blue/active, green/standby)
- Deploy to green, test, then switch traffic
- Instant rollback capability

### Rolling Deployment (Recommended for Sprint 1)
- Update servers one at a time
- Zero downtime
- Gradual rollout reduces risk

### Canary Deployment (Future)
- Deploy to small percentage of users first
- Monitor metrics
- Gradually increase traffic
