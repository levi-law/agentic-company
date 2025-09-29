# Technologies and Frameworks

This document summarises the key technologies used in the Business‑Builder Agent and provides context on the evolving agentic AI landscape.

## LangChain and LangGraph

### LangGraph

LangGraph is a low‑level agent orchestration framework promoted to v1.0 in 2025.  It is used by companies like Uber and LinkedIn and provides a **built‑in agent runtime** with durable execution, short‑term memory and human‑in‑the‑loop patterns【797340751249754†L29-L35】.  It enables developers to build arbitrary workflows and agentic patterns, giving fine‑grained control over execution.

The June 2025 updates introduced **node caching** to skip redundant computation and speed up iterative development, and **deferred nodes** that delay execution until all upstream paths complete—useful for map‑reduce, consensus and collaborative agents【771092070292935†L60-L76】.  Pre/post model hooks and built‑in provider tools (e.g. web search) were added to ReAct agents【771092070292935†L81-L91】, and LangGraph.js gained resumable streams and improved developer ergonomics.

### LangChain

LangChain provides high‑level abstractions for chains and agents.  In 2025 it was refocused around a simple agent pattern: give an LLM access to tools, call it with input, execute tools when requested, and loop until the LLM finishes【797340751249754†L48-L56】.  The new `create_agent` function builds this pattern on top of LangGraph to take advantage of its durable runtime【797340751249754†L61-L66】.

LangChain 1.0 also promoted `langchain-core` as a base package for integrations and standardised message formats.  A new `.content_blocks` property supports multimodal messages and reflects the evolution of LLM APIs【797340751249754†L86-L97】.  A unified documentation site centralises Python and JavaScript docs【797340751249754†L99-L104】.

### Other Frameworks

- **CrewAI** – A role‑based multi‑agent framework built on the LangChain ecosystem.  It offers rapid prototyping and intuitive configuration, making it suitable for teams new to agentic AI and for collaborative tasks like content creation and research【261370890818637†L321-L340】.
- **OpenAI Swarm** – A lightweight experimental framework designed for simple multi‑agent coordination.  It has a streamlined API, easy integration with OpenAI models and is best suited for research prototypes and experimental projects【261370890818637†L343-L359】.
- **Semantic Kernel** – Microsoft’s SDK for integrating AI into enterprise applications.  It provides strong .NET integration, enterprise‑grade security, a skill‑based architecture and built‑in memory/context management【261370890818637†L361-L377】.  It is ideal for business applications in regulated environments or where .NET is the primary stack.
- **AutoGen** – A reliability‑focused framework emphasising error handling and complex workflows (not directly cited here but mentioned for completeness).  It is often chosen for production systems requiring robust execution and vertical/horizontal agents.

### Choosing a Framework

Selecting the right framework depends on multiple factors:

1. **Use‑case complexity** – CrewAI or OpenAI Swarm are good for simple workflows; LangGraph suits complex orchestrations【261370890818637†L406-L418】.
2. **Development expertise** – CrewAI has the gentlest learning curve, while LangGraph and AutoGen offer more power for experienced teams【261370890818637†L406-L418】.
3. **Infrastructure requirements** – For enterprise deployments or .NET integration, AutoGen or Semantic Kernel may be preferable【261370890818637†L406-L418】.
4. **Integration needs** – If you already use the LangChain ecosystem, LangGraph or CrewAI integrate seamlessly; for Microsoft ecosystems choose Semantic Kernel【261370890818637†L406-L418】.

Implementation success also depends on **infrastructure readiness** (GPU resources, distributed computing, appropriate storage) and **security and compliance** (strict access controls, encryption, governance).  Teams should invest in **training and documentation**, start with pilot testing, and adopt incremental scaling with continuous improvement【261370890818637†L431-L475】.

## React Native

React Native is a cross‑platform framework for building native mobile apps using React and JavaScript or TypeScript.  For our project it powers the client application, providing a modern user interface, offline capabilities and integration with mobile device features.  The codebase will live in the same GitHub repository as the backend, enabling shared CI/CD pipelines.

## Python Ecosystem

The backend is built with Python, leveraging LangChain/LangGraph for agent orchestration.  Other libraries include FastAPI for HTTP APIs, Celery or Dramatiq for asynchronous task queues, and libraries like Pandas/NumPy for data processing.  Tests are written with PyTest, and linting uses Ruff or Flake8.

## GitHub

GitHub provides source control, collaboration and CI/CD.  We recommend a trunk‑based workflow with short‑lived feature branches and Pull Requests.  Use GitHub Actions to run unit/integration tests, code quality checks and deployment pipelines.  Secrets such as GCP service account keys and API tokens should be stored in GitHub’s encrypted secrets and passed to workflows through environment variables.

## Google Cloud Platform (GCP)

GCP will host the backend and store artefacts.  Core services include:

- **Cloud Run / Cloud Functions** for serverless deployment of Python APIs.
- **Compute Engine** or **Kubernetes (GKE)** for more control over scaling.
- **Cloud Storage** for storing artefacts (reports, models, assets).
- **Cloud SQL** or **Firestore** for relational or NoSQL storage.
- **IAM service accounts** to control access.  Create dedicated service accounts for each component, follow least‑privilege principles and rotate keys regularly.  Avoid using default service accounts or granting broad owner roles.  Use Secret Manager or GCP‑managed keys for credential storage.
