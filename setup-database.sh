#!/bin/bash

# Database Setup Script for Agentic Company
# This script helps you set up the PostgreSQL database

set -e

echo "🚀 Agentic Company - Database Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.sample..."
    cp .env.sample .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env and set your DATABASE_URL and OPENAI_API_KEY"
    echo "   Example: DATABASE_URL=\"postgresql://user:password@localhost:5432/agentic_company\""
    echo ""
    read -p "Press Enter after you've configured .env..."
else
    echo "✅ .env file exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma Client..."
npm run db:generate

echo ""
echo "🗄️  Setting up database..."
echo ""
echo "Choose setup method:"
echo "1) Push schema to database (recommended for development)"
echo "2) Create migration (recommended for production)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Pushing schema to database..."
        npm run db:push
        ;;
    2)
        echo "Creating migration..."
        npm run db:migrate
        ;;
    *)
        echo "Invalid choice. Defaulting to push..."
        npm run db:push
        ;;
esac

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 You're ready to go!"
echo ""
echo "Next steps:"
echo "  1. Start the development server: npm run dev"
echo "  2. Open Prisma Studio to view data: npm run db:studio"
echo "  3. Visit http://localhost:3000"
echo ""
echo "For more information, see:"
echo "  - DATABASE_SETUP.md"
echo "  - DATABASE_INTEGRATION.md"
echo ""
