# Business-Builder Agent Configuration

This agent configuration implements the complete Business-Builder Agent platform as described in the project overview.

## Overview

The Business-Builder Agent transforms entrepreneurial ideas into fully operational, production-ready businesses. It operates in two distinct phases:

1. **Planning Phase**: CEO-level strategic planning with human-AI collaboration
2. **Execution Phase**: Autonomous agent teams with human assistance for authentication, approvals, and complex decisions

## Agent Architecture

### CEO Agent
- **Role**: Strategic planning and team coordination
- **Voice**: alloy
- **Responsibilities**:
  - Business discovery and analysis
  - Strategic planning and mission breakdown
  - Task generation across all departments
  - Team delegation and oversight
  - Approval management

### Department Teams (Producer + QA Pairs)

#### Technical Development Team
- **Developer Agent** (echo): Builds production-ready technical infrastructure
- **Code Review Agent** (fable): Ensures code quality and production readiness

#### Marketing Team
- **Marketing Agent** (shimmer): Creates comprehensive marketing infrastructure
- **Performance Analytics Agent** (coral): Optimizes campaigns based on data

#### Sales Team
- **Sales Agent** (verse): Builds complete sales infrastructure
- **Sales Performance Agent** (alloy): Optimizes sales processes

#### Legal & Compliance Team
- **Legal Agent** (echo): Handles all legal matters
- **Compliance Review Agent** (fable): Validates legal compliance

#### Finance & Accounting Team
- **Finance Agent** (shimmer): Manages all financial operations
- **Financial Audit Agent** (coral): Validates financial accuracy

#### Operations Team
- **Operations Agent** (verse): Ensures operational excellence
- **Quality Assurance Agent** (alloy): Validates operational quality

#### HR Team
- **HR Agent** (echo): Manages human resources operations
- **HR Compliance Agent** (fable): Ensures HR legal compliance

## CEO Tools

### generateBusinessPlan
Creates a comprehensive business plan covering all business aspects.

**Parameters**:
- `businessName`: Name of the business
- `businessIdea`: Core business idea and value proposition
- `targetMarket`: Target market and customer segments
- `revenueModel`: Revenue model and pricing strategy
- `timeline`: Expected timeline for launch (optional)
- `budget`: Available budget or funding (optional)

### generateTasks
Generates detailed task list across all departments.

**Parameters**:
- `businessId`: Business ID from the generated business plan
- `focusAreas`: Optional array of specific areas to focus on

**Generates tasks for**:
- Technical Development (repository, architecture, development, infrastructure, security, monitoring)
- Marketing (brand identity, content, SEO/SEM, social media, email marketing)
- Sales (CRM, sales funnels, proposals, lead generation)
- Legal (entity formation, contracts, privacy policies, IP protection)
- Finance (banking, accounting, invoicing, financial reporting)
- Operations (SOPs, customer support, vendor management)
- HR (policies, recruitment, payroll)

### requestApproval
Requests approval for plans or high-impact decisions.

**Parameters**:
- `approvalType`: Type of approval (business_plan, task_list, spending, strategic_decision, milestone)
- `title`: Title of what needs approval
- `description`: Detailed description
- `impact`: Impact level (low, medium, high, critical)
- `estimatedCost`: Estimated cost if applicable (optional)

### delegateToTeam
Delegates tasks to specialized department teams.

**Parameters**:
- `taskIds`: Array of task IDs to delegate
- `department`: Department to delegate to
- `priority`: Priority level (optional)
- `instructions`: Additional instructions or context (optional)

### getTaskStatus
Gets the current status of tasks.

**Parameters**:
- `department`: Optional filter by department
- `status`: Optional filter by status (pending, in_progress, review, completed, blocked)

### updateTaskProgress
Updates the progress and status of a specific task.

**Parameters**:
- `taskId`: ID of the task to update
- `status`: New status
- `notes`: Progress notes or updates (optional)
- `blockers`: Any blockers or issues (optional)

## Conversation Flow

1. **Discovery**: CEO Agent greets entrepreneur and asks about business idea
2. **Strategic Planning**: CEO Agent asks clarifying questions about market, customers, goals
3. **Business Plan Generation**: CEO Agent creates comprehensive plan using `generateBusinessPlan`
4. **Task Generation**: CEO Agent generates detailed tasks using `generateTasks`
5. **Approval**: CEO Agent requests approval using `requestApproval`
6. **Execution**: CEO Agent delegates tasks to teams using `delegateToTeam`
7. **Monitoring**: CEO Agent tracks progress using `getTaskStatus` and `updateTaskProgress`
8. **Coordination**: CEO Agent coordinates across departments and handles approvals

## Quality Assurance

Every Producer agent is paired with a QA/Review agent:
- **Developer** → **Code Review**: Full CI regression, security scanning, performance checks
- **Marketing** → **Performance Analytics**: Campaign metrics, ROI analysis
- **Sales** → **Sales Performance**: Conversion rates, CAC tracking
- **Legal** → **Compliance Review**: Regulatory compliance validation
- **Finance** → **Financial Audit**: Financial accuracy and reconciliation
- **Operations** → **Quality Assurance**: Process validation and quality benchmarks
- **HR** → **HR Compliance**: Labor law compliance verification

## Production-Ready Focus

This platform emphasizes production-ready deliverables, not MVPs or POCs:
- Full test coverage and CI/CD pipelines
- Security scanning and compliance
- Complete business infrastructure
- Operational monitoring and analytics
- Legal compliance and documentation
- Financial systems and reporting
- Scalable architecture

## Usage

To use the Business-Builder Agent:

1. Select "businessBuilder" from the Scenario dropdown
2. Select "CEO" as the starting agent
3. Connect to start the conversation
4. Describe your business idea to the CEO Agent
5. Follow the strategic planning process
6. Review and approve the generated plan
7. Monitor execution as tasks are delegated to teams

## Future Enhancements

- Persistent storage (database instead of in-memory)
- Real integration with business APIs (Stripe, QuickBooks, GitHub, etc.)
- Enhanced UI for task tracking and progress visualization
- Automated testing and validation workflows
- Multi-session support with state persistence
- Advanced analytics and reporting dashboards
