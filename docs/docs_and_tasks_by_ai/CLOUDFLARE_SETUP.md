# 🔐 Secure Cloudflare Setup Guide

## ⚠️ SECURITY WARNING
**NEVER share your API keys publicly or commit them to version control!**

If you've accidentally shared your API key, **regenerate it immediately** in your Cloudflare dashboard.

## Step 1: Get Your Cloudflare Credentials

### Option A: API Token (Recommended - More Secure)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom Token" template
4. Set permissions:
   - **Zone:Zone:Read**
   - **Zone:Page Rules:Edit** 
   - **Account:Cloudflare Pages:Edit**
5. Set Account Resources: Include your account
6. Copy the generated token

### Option B: Global API Key (Less Secure)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Scroll to "Global API Key" section
3. Click "View" and copy the key
4. You'll also need your Cloudflare email address

## Step 2: Get Your Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select any domain or go to the right sidebar
3. Copy your "Account ID" from the right sidebar

## Step 3: Configure Environment Variables

### Create .env.cloudflare file:
```bash
# Copy the template
cp .env.cloudflare.example .env.cloudflare

# Edit with your actual values
nano .env.cloudflare
```

### Fill in your credentials:
```bash
# Option A: Using API Token (Recommended)
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Option B: Using Global API Key (if not using token)
CLOUDFLARE_API_KEY=your_global_api_key_here
CLOUDFLARE_EMAIL=your_cloudflare_email_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Project configuration
CLOUDFLARE_PROJECT_NAME=agentic-company-app
```

## Step 4: Secure Your API Key

### If you accidentally shared your API key:
1. **Immediately go to Cloudflare Dashboard**
2. **Regenerate/Delete the exposed key**
3. **Create a new API token/key**
4. **Update your .env.cloudflare file**

### Best Practices:
- ✅ Use API Tokens instead of Global API Key
- ✅ Set minimal required permissions
- ✅ Regularly rotate your keys
- ✅ Never commit .env files to git
- ✅ Use different keys for different environments

## Step 5: Deploy

Now you can safely deploy:
```bash
# Make script executable
chmod +x cloudflare-deploy.sh

# Deploy
./cloudflare-deploy.sh
```

## Troubleshooting

### "Authentication failed" error:
1. Check your API token/key is correct
2. Verify account ID is correct
3. Ensure API token has correct permissions
4. Try logging in manually: `wrangler login`

### "Project not found" error:
1. The project will be created automatically on first deploy
2. Check project name in .env.cloudflare matches wrangler.toml

### Build errors:
1. Check Node.js version (use Node 18+)
2. Clear cache: `rm -rf .next node_modules && npm install`
3. Check environment variables in openai-realtime-agents/.env

## Security Checklist

- [ ] API key is not committed to version control
- [ ] .env.cloudflare is in .gitignore
- [ ] Using API Token instead of Global API Key
- [ ] API Token has minimal required permissions
- [ ] Old/exposed keys have been regenerated
- [ ] Environment variables are set in Cloudflare Pages dashboard

## Need Help?

1. Check [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
2. Review [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
3. Check the DEPLOYMENT.md file for detailed instructions
