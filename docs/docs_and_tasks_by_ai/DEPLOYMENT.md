# Cloudflare Pages Deployment Guide

This guide covers deploying the Agentic Company platform to Cloudflare Pages.

## Quick Deployment

### Option 1: Automated Script
```bash
# Make the script executable
chmod +x cloudflare-deploy.sh

# Run the deployment script
./cloudflare-deploy.sh
```

### Option 2: Manual Deployment
```bash
# Navigate to the app directory
cd openai-realtime-agents

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=agentic-company-app
```

## Prerequisites

### 1. Cloudflare Account Setup
- Create a [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Install Wrangler CLI: `npm install -g wrangler`
- Login to Cloudflare: `wrangler login`

### 2. Environment Variables
Create a `.env` file in the `openai-realtime-agents` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Project Configuration
The following files have been configured for Cloudflare deployment:
- `wrangler.toml` - Cloudflare Workers configuration
- `next.config.ts` - Next.js configuration optimized for Cloudflare
- `_headers` - Custom HTTP headers for security and caching
- `_redirects` - URL redirects and SPA routing
- `functions/api/[[...route]].ts` - API route handler for Cloudflare Functions

## Deployment Steps

### 1. Initial Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd agentic-company

# Install dependencies
cd openai-realtime-agents
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.sample .env

# Edit .env with your actual values
nano .env
```

### 3. Build and Deploy
```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=agentic-company-app
```

### 4. Configure Environment Variables in Cloudflare
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

## CI/CD Pipeline

### GitHub Actions Setup
1. Add the following secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `OPENAI_API_KEY`: Your OpenAI API key

2. The workflow file `.github/workflows/cloudflare-deploy.yml` will automatically deploy on push to main/master.

### Manual CI/CD Trigger
```bash
# Trigger deployment manually
git push origin main
```

## Custom Domain Setup

### 1. Add Custom Domain
1. Go to Cloudflare Pages Dashboard
2. Select your project
3. Go to Custom Domains
4. Add your domain (e.g., `app.yourdomain.com`)

### 2. DNS Configuration
Add a CNAME record in your DNS settings:
```
CNAME app agentic-company-app.pages.dev
```

### 3. SSL Certificate
Cloudflare automatically provides SSL certificates for custom domains.

## Performance Optimization

### Caching Strategy
- Static assets: 1 year cache
- Images: 1 year cache
- API routes: No cache
- HTML pages: Browser cache only

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content Security Policy: Configured for OpenAI API

### Edge Runtime
The application is configured to use Cloudflare's Edge Runtime for optimal performance.

## Monitoring and Analytics

### Cloudflare Analytics
- Real-time traffic analytics
- Performance metrics
- Security insights
- Available in Cloudflare Dashboard

### Custom Analytics
You can add additional analytics by integrating:
- Google Analytics
- Mixpanel
- PostHog
- Custom tracking solutions

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables Not Working
1. Check Cloudflare Pages Dashboard > Settings > Environment Variables
2. Ensure variables are set for both Production and Preview environments
3. Redeploy after adding variables

#### API Routes Not Working
1. Check `functions/api/[[...route]].ts` configuration
2. Verify Cloudflare Functions are enabled
3. Check function logs in Cloudflare Dashboard

#### Domain Issues
1. Verify DNS settings
2. Check SSL certificate status
3. Ensure domain is properly configured in Cloudflare

### Debug Commands
```bash
# Check deployment status
wrangler pages deployment list --project-name=agentic-company-app

# View function logs
wrangler pages deployment tail --project-name=agentic-company-app

# Test local build
npm run build && npm run start
```

## Advanced Configuration

### Custom Build Command
Modify `wrangler.toml` to customize the build process:
```toml
[build]
command = "npm run build"
cwd = "openai-realtime-agents"
```

### Multiple Environments
Configure different environments in `wrangler.toml`:
```toml
[env.staging]
name = "agentic-company-app-staging"

[env.production]
name = "agentic-company-app"
```

### Custom Functions
Add custom Cloudflare Functions in the `functions/` directory for server-side logic.

## Support

For deployment issues:
1. Check [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check the project's GitHub Issues
4. Contact the development team

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use Cloudflare's secure environment variable storage
3. **HTTPS**: Always use HTTPS in production (automatically enabled)
4. **Headers**: Security headers are configured automatically
5. **CORS**: Configure CORS policies for API routes

## Cost Optimization

Cloudflare Pages offers:
- **Free Tier**: 500 builds/month, unlimited requests
- **Pro Tier**: Additional features and higher limits
- **Pay-as-you-go**: For high-traffic applications

Monitor usage in the Cloudflare Dashboard to optimize costs.
