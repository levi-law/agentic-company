# Setup Guide

This guide explains how to set up your development environment for the Business‑Builder Agent project using GitHub, Google Cloud Platform (GCP), Python and React Native.  It assumes basic familiarity with command‑line tools and version control.

## 1. Repository and Version Control (GitHub)

1. **Create the repository** – Sign in to GitHub and create a new private repository named `business‑builder‑agent`.  Initialise it with a `README.md` and a `.gitignore` for Python and React Native.
2. **Branching strategy** – Adopt trunk‑based development.  Keep the `main` branch deployable.  For each feature or bug fix, create a short‑lived branch (`feature/xyz`) and open a Pull Request (PR).  Require at least one code review and successful CI checks before merging.
3. **GitHub Actions** – Add workflow files under `.github/workflows/`:
   - `ci.yml` – Runs linting (Ruff), tests (pytest), type checks (mypy) and static analysis for both backend and mobile code.
   - `deploy.yml` – Builds a Docker image on merges to `main`, pushes to GCR (Google Container Registry) and deploys to Cloud Run or GKE using `gcloud` CLI.
   - Store secrets (e.g. `GCP_SERVICE_ACCOUNT_KEY`, `OPENAI_API_KEY`) in GitHub Secrets.  Reference them in workflow steps via `${{ secrets.GCP_SERVICE_ACCOUNT_KEY }}`.

## 2. Google Cloud Platform Configuration

1. **Create a GCP project** – Use the Cloud Console or CLI (`gcloud projects create`).  Enable APIs: Cloud Run, Cloud Functions, Cloud Storage, Artifact Registry, IAM, Secret Manager and Cloud SQL if needed.
2. **Service accounts** – For each component (backend API, agent orchestrator, workers) create a dedicated service account (`backend-sa@project.iam.gserviceaccount.com`, etc.).  Grant minimal roles: e.g. `roles/run.admin` to deploy services, `roles/storage.objectAdmin` for file storage, `roles/secretmanager.secretAccessor` for reading secrets.  **Do not** use the default Compute Engine or App Engine service accounts.  Rotate keys regularly and store them in GitHub Secrets or your local secure storage.
3. **Secret management** – Store sensitive credentials in **Secret Manager**.  For example, create secrets `openai-api-key`, `serpapi-key`, etc.  Give the service accounts permission to access these secrets.  In your application, use the Google Cloud client libraries to retrieve secrets at runtime.
4. **Deploy Cloud Run services** – Install the `gcloud` CLI locally.  Use `gcloud run deploy` to deploy the API and orchestrator containers.  Example:
   ```bash
   gcloud run deploy backend-api \
     --image gcr.io/$PROJECT_ID/backend-api:$IMAGE_TAG \
     --region europe-west1 \
     --service-account backend-sa@$PROJECT_ID.iam.gserviceaccount.com \
     --allow-unauthenticated
   ```
   Repeat for the orchestrator and worker services.  Use `--no-allow-unauthenticated` for private endpoints.
5. **Database setup** – Provision a **Cloud SQL** instance or **Firestore** database.  For Cloud SQL, create a Postgres instance.  Store connection strings in Secret Manager.  Configure SQL users with strong passwords and minimal privileges.
6. **Storage** – Create a Cloud Storage bucket for artefacts (documents, CSVs, images).  Enable Object Versioning to track changes.  Assign appropriate roles (`roles/storage.objectAdmin` for writers, `roles/storage.objectViewer` for readers).

## 3. Business Integration Hub Setup

### Third‑Party API Configuration
1. **Financial Services Integration**
   ```python
   # config/integrations/financial.py
   FINANCIAL_INTEGRATIONS = {
       'stripe': {
           'api_key': os.getenv('STRIPE_SECRET_KEY'),
           'webhook_secret': os.getenv('STRIPE_WEBHOOK_SECRET'),
           'capabilities': ['payments', 'subscriptions', 'invoicing']
       },
       'quickbooks': {
           'client_id': os.getenv('QB_CLIENT_ID'),
           'client_secret': os.getenv('QB_CLIENT_SECRET'),
           'capabilities': ['accounting', 'reporting', 'tax_prep']
       }
   }
   ```

2. **Marketing Platform Integration**
   ```python
   # config/integrations/marketing.py
   MARKETING_INTEGRATIONS = {
       'google_ads': {
           'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
           'client_id': os.getenv('GOOGLE_ADS_CLIENT_ID'),
           'capabilities': ['campaign_management', 'keyword_research', 'analytics']
       },
       'hubspot': {
           'api_key': os.getenv('HUBSPOT_API_KEY'),
           'capabilities': ['crm', 'email_marketing', 'lead_tracking']
       }
   }
   ```

### API Gateway Configuration
```yaml
# kong/kong.yaml
_format_version: "3.0"
services:
- name: business-integration-hub
  url: http://integration-service:8000
  plugins:
  - name: rate-limiting
    config:
      minute: 1000
      hour: 10000
  - name: oauth2
    config:
      scopes:
      - business_read
      - business_write
```

## 4. Mobile Client (React Native)

1. **Setup** – Install Node.js (v18+) and Yarn/PNPM.  Initialise the project using Expo or the React Native CLI:
   ```bash
   npx create-expo-app mobile-app
   cd mobile-app
   npm install
   ```
2. **Directory structure** – Organise screens, components, services (API clients), state management (Redux or React Context).  Use TypeScript for type safety.
3. **Environment** – Use `.env` files for API endpoints and feature flags.  Use `react-native-dotenv` to load them.  Do not commit secrets.
4. **Testing** – Use Jest and React Native Testing Library for unit tests.  For end‑to‑end tests, use Detox or Playwright on mobile.
5. **CI** – Set up a GitHub Actions workflow to build the app and run tests.  For releases, use Expo Application Services (EAS) or Fastlane to build and submit to app stores.

## 5. Local Secrets and API Keys

- **OpenAI API** – Required for language model calls.  Sign up at OpenAI and obtain an API key.  Store it as `OPENAI_API_KEY` in Secret Manager and GitHub Secrets.
- **Search API (e.g. SerpAPI or Tavily)** – Agents need a search tool.  Obtain API keys and store them securely.  Configure usage quotas to control costs.
- **Vector Database** – Choose a provider (Weaviate Cloud, Pinecone, Chroma).  Obtain credentials and endpoints.  Set environment variables accordingly.
- **Email and Ads APIs** – If the agent drafts emails or ad campaigns, create service accounts or API keys (e.g. Gmail API, Facebook Ads API).  Because sending emails or ads is a high‑impact action, require explicit user approval before the agent uses these keys.

## 6. CI/CD Pipeline Setup

### GitHub Actions Workflows
1. **Multi‑Environment Pipeline**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy Business Builder
   on:
     push:
       branches: [main]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v4
       - name: Run Agent Tests
         run: |
           pytest tests/agents/ --cov=90
           pytest tests/integrations/ --cov=85
   
     deploy-staging:
       needs: test
       runs-on: ubuntu-latest
       steps:
       - name: Deploy to Staging
         run: |
           helm upgrade --install business-builder-staging \
             ./helm/business-builder \
             --namespace staging \
             --set image.tag=${{ github.sha }}
   
     deploy-production:
       needs: deploy-staging
       runs-on: ubuntu-latest
       if: github.ref == 'refs/heads/main'
       steps:
       - name: Deploy to Production
         run: |
           helm upgrade --install business-builder-prod \
             ./helm/business-builder \
             --namespace production \
             --set image.tag=${{ github.sha }}
   ```

### Helm Chart Configuration
```yaml
# helm/business-builder/values.yaml
image:
  repository: business-builder/platform
  tag: latest
  pullPolicy: IfNotPresent

agentTeams:
  technical:
    replicas: 3
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
  marketing:
    replicas: 2
    resources:
      requests:
        memory: "512Mi"
        cpu: "250m"

monitoring:
  enabled: true
  prometheus:
    enabled: true
  grafana:
    enabled: true
```

## 7. Deployment Checklist

- [ ] All tests pass and coverage meets target (>85 %).
- [ ] Secrets stored in GitHub and GCP are up to date.
- [ ] Service accounts have minimal roles and keys rotated.
- [ ] Docker image built and scanned for vulnerabilities.
- [ ] Cloud Run or GKE manifests updated with the new image.
- [ ] Mobile app configuration points to the production API endpoint.

Following these steps will give you a robust foundation for building and deploying the Business‑Builder Agent on GitHub and GCP.  Adjust roles and resources based on your organisation’s compliance requirements and scale.
