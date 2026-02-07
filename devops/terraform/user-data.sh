#!/bin/bash
set -e

# User data script for DigitalOcean droplets
# Runs on first boot to set up the server

echo "Starting server setup for ${environment} environment..."

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    curl \
    wget \
    git \
    htop \
    vim \
    ufw \
    fail2ban \
    unattended-upgrades

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# Configure fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Install Docker (if not already installed)
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker root
fi

# Install Docker Compose
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
curl -L "https://github.com/docker/compose/releases/download/$COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /opt/app
cd /opt/app

# Create .env file placeholder
cat > /opt/app/.env.${environment} << 'EOF'
# Environment variables will be managed via secrets
NODE_ENV=${environment}
PORT=3000
EOF

# Set up log rotation
cat > /etc/logrotate.d/app << 'EOF'
/var/log/app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 root root
    sharedscripts
}
EOF

# Configure automatic security updates
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::Automatic-Reboot "false";
EOF

echo "Server setup complete!"
