#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Authentication API - Sprint 1 Setup Script         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your database credentials!"
else
    echo "✅ .env file already exists"
fi

# Check for PostgreSQL
if command -v docker &> /dev/null; then
    echo ""
    read -p "🐳 Do you want to start PostgreSQL with Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting PostgreSQL container..."
        docker run -d \
            --name auth-postgres \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -e POSTGRES_DB=auth_db \
            -p 5432:5432 \
            postgres:15-alpine 2>/dev/null || echo "Container may already exist"
        
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 5
        
        # Update .env with Docker credentials
        sed -i.bak 's/DB_PASSWORD=.*/DB_PASSWORD=postgres/' .env && rm -f .env.bak
        echo "✅ Updated .env with Docker PostgreSQL credentials"
    fi
elif command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client detected"
else
    echo "⚠️  PostgreSQL not detected. Please install PostgreSQL or use Docker."
fi

# Run migrations
echo ""
read -p "🗄️  Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npm run db:migrate
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                   Setup Complete!                      ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║                                                        ║"
echo "║  To start the development server:                      ║"
echo "║    npm run dev                                         ║"
echo "║                                                        ║"
echo "║  To run tests:                                         ║"
echo "║    npm test                                            ║"
echo "║                                                        ║"
echo "║  To test API endpoints:                                ║"
echo "║    npm run test:api                                    ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"