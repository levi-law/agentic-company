# Agent Design and Feedback Loops

Building a reliable business‑builder agent requires more than a single LLM with tool access.  It demands **structured planning**, **specialised sub‑agents**, and **robust feedback loops** to ensure that outputs meet objective criteria.  This document outlines the design for our agent teams.

## Planning Agent

The planning agent is responsible for decomposing a high‑level business goal into discrete tasks and defining acceptance criteria.  It follows the **agent pattern** described in LangChain: an LLM is given access to tools, decides whether to call a tool, executes the tool, receives the result and repeats until finished【797340751249754†L48-L56】.  The planning agent uses this loop to ask clarifying questions, gather context and produce a task list.  Each task includes:

- A **description** of what to accomplish.
- **Inputs** (e.g. data sources, user preferences).
- **Deliverables** (documents, spreadsheets, code, campaigns).
- **Acceptance criteria** (hard gates and soft targets).
- **Max attempts** and escalation rules.

The plan explicitly marks checkpoints that require user approval.

## Producer–Reviewer Pairs

For each domain (code, marketing, research, finance, content), we create a **Doer agent** (producer) and a **QA agent** (reviewer).  The Doer executes the task; the QA agent validates the output against the acceptance criteria.  They operate in a loop:

1. **Doer**: Runs tools (e.g. code scaffolder, spreadsheet generator, web search) to produce deliverables.
2. **QA agent**: Calls non‑LLM evaluators (CI pipeline, coverage analysis, citation checks) and synthesises a fix list.  Only objective metrics determine success—self‑confidence is not accepted.
3. **Reflect**: If the QA fails, the system posts actionable feedback to the Doer and retries until the maximum attempts are reached or the QA passes.

This pattern ensures that code compiles, tests pass, campaigns meet their KPIs and research includes citations.  It also enforces alignment with acceptance contracts and reduces hallucinations.

## Acceptance Contracts

Contracts define what “done” means.  For each task, they include hard gates that must be satisfied and soft targets that are desirable but not mandatory.  Examples:

- **Code tasks**: All unit and integration tests pass; coverage above 85 %; no breaking API changes; static analysis reports no critical vulnerabilities; performance within latency budgets.
- **Marketing tasks**: Experiment design is valid; no policy violations; tracking snippets are present; cost per acquisition (CPA) stays below a target for a defined horizon; experiments roll back if CPA rises above a threshold.
- **Research tasks**: Every factual claim is supported by at least one citation; information comes from trustworthy sources; no plagiarism; no contradictions.
- **Finance tasks**: Financial models reconcile (balance sheet balances, cash flow matches Δcash); assumptions are documented; sensitivity analysis is included.

## Feedback Loop Implementation

We implement the feedback loop using LangGraph’s state machine.  The state tracks the current task, attempts, artefacts and QA reports.  Nodes include:

- **Doer node**: Executes the Doer agent.  Returns artefact references and updates state.
- **QA node**: Invokes evaluators and the QA agent.  Determines whether hard gates pass.
- **Reflect node**: If QA fails, synthesises a fix list and increments the attempt counter.

A conditional edge routes back to the Doer if more attempts are allowed, or ends the workflow if the task is approved or failed.  This pattern ensures deterministic evaluation and prevents infinite loops.

## Human‑in‑the‑Loop

Certain actions require explicit approval from the user.  The orchestrator pauses execution and prompts the mobile app to present an approval screen.  Examples include:

- **Naming & Domain Purchase**: Suggest names and check domain availability; user chooses the final name and domain.
- **Deploy to Production**: Promote code from staging to production; user reviews CI results and approves.
- **Paid Campaigns**: Launch marketing campaigns; user reviews budgets and metrics.

## Multi‑Agent Collaboration

Our system supports both **vertical** and **horizontal** collaboration.  Vertical patterns allow one agent to orchestrate sub‑agents (e.g. a Project Manager agent coordinating researcher, engineer and marketer).  Horizontal patterns allow multiple agents to collaborate on the same task (e.g. two researchers cross‑validate sources).  LangGraph’s deferred nodes and consensus patterns support these workflows【771092070292935†L60-L76】.

## Limitations and Safeguards

- **Cost and Latency**: Agentic systems trade off speed for quality.  Use smaller models for simple tasks and larger models for complex reasoning.  Monitor token usage and set budgets.
- **Safety**: Agents can only access whitelisted tools.  The sandbox environment restricts file system and network access.  All code execution occurs in isolated containers.
- **Escalation**: After a defined number of failed attempts, tasks are escalated to human operators or flagged for redesign.
