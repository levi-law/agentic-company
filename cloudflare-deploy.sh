#!/bin/bash

# Cloudflare Pages Deployment Script for Agentic Company
# This script automates the deployment process to Cloudflare Pages

set -e

echo "🚀 Starting Cloudflare Pages deployment for Agentic Company..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="agentic-company-app"
BUILD_DIR="openai-realtime-agents"
OUTPUT_DIR="out"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "openai-realtime-agents/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_warning "Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Navigate to the Next.js app directory
cd $BUILD_DIR

print_status "Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.sample..."
    if [ -f ".env.sample" ]; then
        cp .env.sample .env
        print_warning "Please update .env with your actual API keys before deployment"
    else
        print_error "No .env.sample file found. Please create .env with required environment variables"
        exit 1
    fi
fi

print_status "Building the application..."
npm run build

print_status "Cleaning up cache files for deployment..."
# Remove cache files that exceed Cloudflare's 25MB limit
rm -rf .next/cache
find .next -name "*.pack" -delete
find .next -size +25M -delete

print_status "Preparing files for Cloudflare Pages..."
# Copy HTML files to the correct location for Cloudflare Pages
cp .next/server/app/index.html .next/ 2>/dev/null || true
cp .next/server/app/_not-found.html .next/404.html 2>/dev/null || true

print_success "Build completed successfully!"

# Load Cloudflare configuration
if [ -f ".env.cloudflare" ]; then
    print_status "Loading Cloudflare configuration..."
    source .env.cloudflare
    export CLOUDFLARE_API_TOKEN
    export CLOUDFLARE_API_KEY
    export CLOUDFLARE_EMAIL
    export CLOUDFLARE_ACCOUNT_ID
else
    print_warning "Cloudflare configuration file not found. Please create .env.cloudflare"
fi

unset CLOUDFLARE_API_TOKEN


# Check if user is logged in to Cloudflare
print_status "Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare. Please login..."
    wrangler login
fi

print_status "Deploying to Cloudflare Pages..."

# Deploy using Wrangler
if wrangler pages deploy .next --project-name=$PROJECT_NAME --commit-dirty=true; then
    print_success "🎉 Deployment successful!"
    print_status "Your app should be available at: https://$PROJECT_NAME.pages.dev"
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi

# Return to project root
cd ..

print_success "✅ Cloudflare deployment completed!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Cloudflare Pages dashboard"
echo "2. Configure custom domain (if needed)"
echo "3. Set up CI/CD pipeline for automated deployments"
echo ""
echo "Dashboard: https://dash.cloudflare.com/pages"
