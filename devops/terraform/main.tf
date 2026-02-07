# Terraform Configuration - DigitalOcean Example
# Adjust for your cloud provider (AWS, GCP, Azure)

terraform {
  required_version = ">= 1.5"
  
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.34"
    }
  }
  
  # Uncomment for remote state (recommended for teams)
  # backend "s3" {
  #   bucket         = "your-terraform-state"
  #   key            = "production/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

provider "digitalocean" {
  token = var.do_token
}

# ============================================
# Variables
# ============================================

variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "sgp1"  # Singapore
}

variable "droplet_size" {
  description = "Droplet size"
  type        = string
  default     = "s-2vcpu-2gb"
}

variable "ssh_keys" {
  description = "SSH key fingerprints"
  type        = list(string)
}

# ============================================
# VPC
# ============================================

resource "digitalocean_vpc" "main" {
  name     = "${var.environment}-vpc"
  region   = var.region
  ip_range = "10.10.0.0/16"
}

# ============================================
# Droplets (App Servers)
# ============================================

resource "digitalocean_droplet" "app" {
  count  = var.environment == "production" ? 2 : 1
  name   = "${var.environment}-app-${count.index + 1}"
  region = var.region
  size   = var.droplet_size
  image  = "docker-20-04"
  
  vpc_uuid = digitalocean_vpc.main.id
  ssh_keys = var.ssh_keys
  
  tags = [
    "environment:${var.environment}",
    "role:app"
  ]
  
  user_data = templatefile("${path.module}/user-data.sh", {
    environment = var.environment
  })
}

# ============================================
# Managed Database (PostgreSQL)
# ============================================

resource "digitalocean_database_cluster" "postgres" {
  name       = "${var.environment}-postgres"
  engine     = "pg"
  version    = "16"
  size       = var.environment == "production" ? "db-s-2vcpu-4gb" : "db-s-1vcpu-1gb"
  region     = var.region
  node_count = var.environment == "production" ? 2 : 1
  
  tags = ["environment:${var.environment}"]
}

resource "digitalocean_database_db" "app" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "app_${var.environment}"
}

resource "digitalocean_database_user" "app" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "app_user"
}

resource "digitalocean_database_firewall" "postgres" {
  cluster_id = digitalocean_database_cluster.postgres.id
  
  dynamic "rule" {
    for_each = digitalocean_droplet.app
    content {
      type  = "droplet"
      value = rule.value.id
    }
  }
}

# ============================================
# Managed Redis
# ============================================

resource "digitalocean_database_cluster" "redis" {
  name       = "${var.environment}-redis"
  engine     = "redis"
  version    = "7"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
  
  tags = ["environment:${var.environment}"]
}

resource "digitalocean_database_firewall" "redis" {
  cluster_id = digitalocean_database_cluster.redis.id
  
  dynamic "rule" {
    for_each = digitalocean_droplet.app
    content {
      type  = "droplet"
      value = rule.value.id
    }
  }
}

# ============================================
# Load Balancer (Production only)
# ============================================

resource "digitalocean_loadbalancer" "app" {
  count  = var.environment == "production" ? 1 : 0
  name   = "${var.environment}-lb"
  region = var.region
  
  vpc_uuid = digitalocean_vpc.main.id
  
  forwarding_rule {
    entry_port     = 443
    entry_protocol = "https"
    
    target_port     = 3000
    target_protocol = "http"
    
    certificate_name = digitalocean_certificate.app[0].name
  }
  
  forwarding_rule {
    entry_port     = 80
    entry_protocol = "http"
    
    target_port     = 3000
    target_protocol = "http"
  }
  
  healthcheck {
    port                   = 3000
    protocol               = "http"
    path                   = "/health"
    check_interval_seconds = 10
    healthy_threshold      = 2
    unhealthy_threshold    = 3
  }
  
  droplet_ids = digitalocean_droplet.app[*].id
}

# ============================================
# SSL Certificate (Production only)
# ============================================

resource "digitalocean_certificate" "app" {
  count = var.environment == "production" ? 1 : 0
  name  = "${var.environment}-cert"
  type  = "lets_encrypt"
  domains = [
    "yourapp.com",
    "www.yourapp.com"
  ]
}

# ============================================
# Firewall
# ============================================

resource "digitalocean_firewall" "app" {
  name = "${var.environment}-app-firewall"
  
  droplet_ids = digitalocean_droplet.app[*].id
  
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]  # Restrict to your IP in production
  }
  
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = var.environment == "production" ? [] : ["0.0.0.0/0"]
    source_load_balancer_uids = var.environment == "production" ? [digitalocean_loadbalancer.app[0].id] : []
  }
  
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# ============================================
# Outputs
# ============================================

output "app_ips" {
  value       = digitalocean_droplet.app[*].ipv4_address
  description = "Application server IP addresses"
}

output "load_balancer_ip" {
  value       = var.environment == "production" ? digitalocean_loadbalancer.app[0].ip : null
  description = "Load balancer IP address"
}

output "database_host" {
  value       = digitalocean_database_cluster.postgres.host
  sensitive   = true
  description = "PostgreSQL host"
}

output "database_connection_string" {
  value       = "postgresql://${digitalocean_database_user.app.name}:${digitalocean_database_user.app.password}@${digitalocean_database_cluster.postgres.host}:${digitalocean_database_cluster.postgres.port}/${digitalocean_database_db.app.name}?sslmode=require"
  sensitive   = true
  description = "PostgreSQL connection string"
}

output "redis_host" {
  value       = digitalocean_database_cluster.redis.host
  sensitive   = true
  description = "Redis host"
}
