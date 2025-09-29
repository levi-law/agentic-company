# System Architecture

The Business‑Builder Agent platform is composed of a mobile client, a backend service, an agent orchestrator and supporting cloud infrastructure.  The design emphasises modularity, scalability, security and ease of development.

## High‑Level Components

| Component | Description |
|---|---|
| **Mobile App (React Native)** | Provides the user interface for entrepreneurs to interact with the system.  It connects to the backend via secure HTTPS and displays chat conversations, task boards, approvals and artefacts. |
| **Backend API (FastAPI)** | Exposes REST or GraphQL endpoints for the mobile app.  Handles authentication, project management, file uploads, and triggers agent workflows.  Deployed on GCP Cloud Run or GKE for scalability. |
| **Agent Orchestrator (LangChain + LangGraph)** | Coordinates planning and execution of tasks.  Stores conversation history and long‑term memory in a vector database.  Manages sub‑agents (research, financials, branding, product, marketing, operations) and invokes tools. |
| **Task Workers** | Execute long‑running or resource‑intensive tasks (web scraping, financial modelling, code generation).  Implemented with Celery, Dramatiq or Cloud Tasks.  Workers run in isolated environments (e.g. Cloud Run jobs or GKE) with restricted permissions. |
| **Data Stores** | Postgres for structured data (users, projects, tasks, artefacts), a vector database (pgvector/Weaviate/Chroma) for semantic search, and Cloud Storage for file artefacts. |
| **CI/CD Pipeline (GitHub Actions)** | Automates testing, linting, building and deployment.  Pull Requests trigger unit/integration tests.  On merge to main, the pipeline builds a container image and deploys to Cloud Run or GKE. |
| **Monitoring and Observability** | Use LangSmith or OpenTelemetry for tracing, Prometheus for metrics and Sentry for error monitoring.  Logs are structured and include correlation IDs for debugging. |

## Backend Workflow

1. **Authentication** – Users sign in via OAuth2 (e.g. Google, GitHub) or email/password.  The backend issues JWT tokens and stores session metadata.
2. **Project Creation** – Users create a project with constraints (industry, budget, region).  The backend stores project metadata.
3. **Planning** – The Agent Orchestrator receives a high‑level goal and calls a planning LLM to decompose it into tasks.  The plan includes acceptance criteria and required approvals.
4. **Task Execution** – For each task, the orchestrator selects a sub‑agent and tool.  Tasks may run asynchronously via workers.  The orchestrator tracks state and stores results.
5. **Feedback Loop** – After a Doer agent produces an artefact, a QA agent validates it against the contract (tests, metrics) and either approves or returns a fix list.  This loop repeats until the QA passes or retry limits are hit.
6. **Approval** – When tasks require user approval (naming, domain purchase, deployment, ads), the backend notifies the mobile app.  The user reviews and approves or rejects.
7. **Deployment & Integration** – For product tasks, the system scaffolds code (e.g. Next.js, Flask) and deploys to a preview environment (Vercel, Cloud Run).  For marketing tasks, campaigns are drafted but not launched until the user approves and enters payment credentials.

## Agent Teams and Memory

Agentic frameworks emphasise three core capabilities—**memory**, **reasoning** and **orchestration**【747994860962326†L160-L162】.  Our design uses:

- **Short‑term memory**: Conversation history and recent observations stored in an in‑memory buffer and the vector store.  Allows the LLM to maintain context across turns.
- **Long‑term memory**: Knowledge chunks (research articles, regulatory docs, previous artefacts) embedded into a vector database for retrieval.  Supports retrieval‑augmented generation.
- **Reasoning and orchestration**: The orchestrator (LangGraph) manages control flow, calls sub‑agents/tools, and ensures the LLM receives the right context【83985443320807†L20-L33】.  It controls loops and ensures tasks stop when acceptance criteria are met.

## Security and IAM

Security is critical when agents can execute code and access external systems.

- **Service Accounts** – Create a dedicated GCP service account for each component (API, worker, orchestrator).  Grant least‑privilege roles (e.g. Cloud Run Invoker, Storage Object Admin) and avoid using default service accounts.  Rotate keys regularly and store secrets in GCP Secret Manager.
- **Data Encryption** – Use HTTPS for all communications.  Enable automatic encryption at rest in Cloud Storage and Postgres.  Use customer‑managed encryption keys if required.
- **Secrets Management** – Store API keys (OpenAI, search, etc.) and database credentials in GitHub Secrets and GCP Secret Manager.  Inject them into runtime environments through environment variables or secret volumes.
- **Audit Logging** – Enable Cloud Audit Logs and maintain a record of all tool invocations, external API calls and approval actions.  Logs help trace issues and support compliance.

## Development Practices

- **Version Control** – Adopt trunk‑based development.  Feature branches should be short‑lived, with Pull Requests triggering automated tests and reviews.
- **Testing** – Write unit tests for each module and integration tests for agent workflows.  Use GitHub Actions to run tests on each commit.  For code generation tasks, include CI checks (building containers, running pytest, coverage, SAST) to ensure generated code compiles and meets quality standards.
- **Documentation** – Document APIs with OpenAPI/Swagger.  Maintain onboarding guides and architecture diagrams in the repository.

## Deployment Options

| Option | Pros | Cons |
|---|---|---|
| **Cloud Run** | Serverless, auto‑scaling, pay‑for‑use, simple deployment.  Good for stateless workloads and bursty traffic. | Limited to HTTP workloads; concurrent connections per instance; cold starts may affect latency. |
| **GKE (Kubernetes)** | Full control over scaling, custom networking, ability to run stateful services.  Good for large systems and complex routing. | Requires cluster management; higher operational overhead. |
| **App Engine** | Simplified PaaS with automatic scaling and built‑in versions. | More opinionated environment; limited runtime customisation. |

We recommend starting with Cloud Run for the API and orchestrator due to its simplicity and then migrating to GKE if you need more control.
