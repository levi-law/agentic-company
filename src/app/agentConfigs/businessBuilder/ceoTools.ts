import { tool } from '@openai/agents/realtime';

// In-memory storage for business plans, tasks, and approvals
// In production, this would be a database
const businessPlans = new Map<string, any>();
const tasks = new Map<string, any>();
const approvalRequests = new Map<string, any>();

// Generate comprehensive business plan
export const generateBusinessPlan = tool({
  name: 'generateBusinessPlan',
  description: 'Generate a comprehensive business plan based on the strategic conversation with the entrepreneur. This creates a detailed plan covering all business aspects: technical, marketing, sales, legal, finance, operations, and HR.',
  parameters: {
    type: 'object',
    properties: {
      businessName: {
        type: 'string',
        description: 'Name of the business',
      },
      businessIdea: {
        type: 'string',
        description: 'Core business idea and value proposition',
      },
      targetMarket: {
        type: 'string',
        description: 'Target market and customer segments',
      },
      revenueModel: {
        type: 'string',
        description: 'Revenue model and pricing strategy',
      },
      timeline: {
        type: 'string',
        description: 'Expected timeline for launch (e.g., "90 days", "6 months")',
      },
      budget: {
        type: 'string',
        description: 'Available budget or funding',
      },
    },
    required: ['businessName', 'businessIdea', 'targetMarket', 'revenueModel'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { businessName, businessIdea, targetMarket, revenueModel, timeline, budget } = input as {
      businessName: string;
      businessIdea: string;
      targetMarket: string;
      revenueModel: string;
      timeline?: string;
      budget?: string;
    };

    const businessId = `biz_${Date.now()}`;

    const plan = {
      id: businessId,
      name: businessName,
      idea: businessIdea,
      targetMarket,
      revenueModel,
      timeline: timeline || '90 days',
      budget: budget || 'To be determined',
      createdAt: new Date().toISOString(),
      status: 'planning',
      phases: {
        technical: {
          description: 'Full-stack application, infrastructure, CI/CD, monitoring, security',
          estimatedDuration: '30-45 days',
          priority: 'high',
        },
        marketing: {
          description: 'Brand development, content creation, SEO/SEM, campaigns, analytics',
          estimatedDuration: '20-30 days',
          priority: 'high',
        },
        sales: {
          description: 'CRM setup, sales funnels, lead generation, proposals, onboarding',
          estimatedDuration: '15-25 days',
          priority: 'high',
        },
        legal: {
          description: 'Entity formation, contracts, privacy policies, IP protection, compliance',
          estimatedDuration: '10-20 days',
          priority: 'critical',
        },
        finance: {
          description: 'Banking, accounting system, invoicing, financial reporting, tax prep',
          estimatedDuration: '15-20 days',
          priority: 'critical',
        },
        operations: {
          description: 'SOPs, vendor management, quality control, customer support, monitoring',
          estimatedDuration: '20-30 days',
          priority: 'medium',
        },
        hr: {
          description: 'Recruitment, onboarding, policies, payroll, performance management',
          estimatedDuration: '15-25 days',
          priority: 'medium',
        },
      },
    };

    businessPlans.set(businessId, plan);

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[CEO] Business Plan Generated', { businessId, businessName });
    }

    return {
      success: true,
      businessId,
      plan,
      message: `Comprehensive business plan created for "${businessName}". The plan covers all 7 business domains with estimated timelines. Ready to generate detailed tasks.`,
    };
  },
});

// Generate detailed tasks across all departments
export const generateTasks = tool({
  name: 'generateTasks',
  description: 'Generate detailed task list across all departments (Technical, Marketing, Sales, Legal, Finance, Operations, HR) based on the business plan. Each task includes description, department, priority, and estimated effort.',
  parameters: {
    type: 'object',
    properties: {
      businessId: {
        type: 'string',
        description: 'Business ID from the generated business plan',
      },
      focusAreas: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional: Specific areas to focus on (e.g., ["technical", "marketing"]). If not provided, generates tasks for all areas.',
      },
    },
    required: ['businessId'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { businessId, focusAreas } = input as {
      businessId: string;
      focusAreas?: string[];
    };

    const plan = businessPlans.get(businessId);
    if (!plan) {
      return {
        success: false,
        error: 'Business plan not found. Please generate a business plan first.',
      };
    }

    // Generate comprehensive task list
    const taskList = [
      // Technical Development Tasks
      {
        id: 'tech_001',
        department: 'Technical',
        title: 'Repository Setup & CI/CD Pipeline',
        description: 'Create GitHub repository, set up CI/CD with automated testing, deployment pipelines',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'critical',
        estimatedHours: 8,
        status: 'pending',
        dependencies: [],
      },
      {
        id: 'tech_002',
        department: 'Technical',
        title: 'Application Architecture & Database Design',
        description: 'Design system architecture, database schema, API structure',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'critical',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['tech_001'],
      },
      {
        id: 'tech_003',
        department: 'Technical',
        title: 'Core Application Development',
        description: 'Implement core features, business logic, user authentication, data models',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'high',
        estimatedHours: 80,
        status: 'pending',
        dependencies: ['tech_002'],
      },
      {
        id: 'tech_004',
        department: 'Technical',
        title: 'Infrastructure as Code Setup',
        description: 'Create Terraform/CloudFormation templates for cloud infrastructure',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'high',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['tech_002'],
      },
      {
        id: 'tech_005',
        department: 'Technical',
        title: 'Security Implementation',
        description: 'SSL certificates, encryption, access controls, security scanning',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'critical',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['tech_003'],
      },
      {
        id: 'tech_006',
        department: 'Technical',
        title: 'Monitoring & Analytics Setup',
        description: 'Application monitoring, error tracking, performance analytics, alerting',
        assignedTo: 'Developer',
        reviewedBy: 'CodeReviewer',
        priority: 'high',
        estimatedHours: 12,
        status: 'pending',
        dependencies: ['tech_003'],
      },

      // Marketing Tasks
      {
        id: 'mkt_001',
        department: 'Marketing',
        title: 'Brand Identity Development',
        description: 'Logo design, brand guidelines, color palette, visual identity',
        assignedTo: 'Marketing',
        reviewedBy: 'PerformanceAnalytics',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: [],
      },
      {
        id: 'mkt_002',
        department: 'Marketing',
        title: 'Website Content Creation',
        description: 'Homepage, product pages, about us, blog posts, SEO optimization',
        assignedTo: 'Marketing',
        reviewedBy: 'PerformanceAnalytics',
        priority: 'high',
        estimatedHours: 40,
        status: 'pending',
        dependencies: ['mkt_001'],
      },
      {
        id: 'mkt_003',
        department: 'Marketing',
        title: 'SEO/SEM Strategy & Implementation',
        description: 'Keyword research, on-page SEO, Google Ads setup, campaign creation',
        assignedTo: 'Marketing',
        reviewedBy: 'PerformanceAnalytics',
        priority: 'high',
        estimatedHours: 30,
        status: 'pending',
        dependencies: ['mkt_002'],
      },
      {
        id: 'mkt_004',
        department: 'Marketing',
        title: 'Social Media Presence Setup',
        description: 'Create profiles, content calendar, initial posts, community management',
        assignedTo: 'Marketing',
        reviewedBy: 'PerformanceAnalytics',
        priority: 'medium',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['mkt_001'],
      },
      {
        id: 'mkt_005',
        department: 'Marketing',
        title: 'Email Marketing Automation',
        description: 'Email sequences, newsletter campaigns, automation workflows',
        assignedTo: 'Marketing',
        reviewedBy: 'PerformanceAnalytics',
        priority: 'medium',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['mkt_002'],
      },

      // Sales Tasks
      {
        id: 'sales_001',
        department: 'Sales',
        title: 'CRM System Setup',
        description: 'Configure CRM, import contacts, set up pipelines, automation rules',
        assignedTo: 'Sales',
        reviewedBy: 'SalesPerformance',
        priority: 'high',
        estimatedHours: 12,
        status: 'pending',
        dependencies: [],
      },
      {
        id: 'sales_002',
        department: 'Sales',
        title: 'Sales Funnel Design',
        description: 'Lead capture forms, nurturing sequences, conversion optimization',
        assignedTo: 'Sales',
        reviewedBy: 'SalesPerformance',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['sales_001'],
      },
      {
        id: 'sales_003',
        department: 'Sales',
        title: 'Proposal Templates & Automation',
        description: 'Create proposal templates, pricing tables, automated generation',
        assignedTo: 'Sales',
        reviewedBy: 'SalesPerformance',
        priority: 'medium',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['sales_001'],
      },
      {
        id: 'sales_004',
        department: 'Sales',
        title: 'Lead Generation Campaign',
        description: 'Outbound campaigns, lead qualification, initial outreach',
        assignedTo: 'Sales',
        reviewedBy: 'SalesPerformance',
        priority: 'high',
        estimatedHours: 30,
        status: 'pending',
        dependencies: ['sales_002'],
      },

      // Legal Tasks
      {
        id: 'legal_001',
        department: 'Legal',
        title: 'Business Entity Formation',
        description: 'LLC/Corp registration, EIN acquisition, state compliance',
        assignedTo: 'Legal',
        reviewedBy: 'ComplianceReview',
        priority: 'critical',
        estimatedHours: 8,
        status: 'pending',
        dependencies: [],
      },
      {
        id: 'legal_002',
        department: 'Legal',
        title: 'Contract Templates',
        description: 'Service agreements, employment contracts, NDAs, vendor agreements',
        assignedTo: 'Legal',
        reviewedBy: 'ComplianceReview',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['legal_001'],
      },
      {
        id: 'legal_003',
        department: 'Legal',
        title: 'Privacy Policies & Terms',
        description: 'GDPR/CCPA compliant privacy policy, Terms of Service, Cookie policy',
        assignedTo: 'Legal',
        reviewedBy: 'ComplianceReview',
        priority: 'critical',
        estimatedHours: 12,
        status: 'pending',
        dependencies: ['legal_001'],
      },
      {
        id: 'legal_004',
        department: 'Legal',
        title: 'Intellectual Property Protection',
        description: 'Trademark registration, copyright protection, IP strategy',
        assignedTo: 'Legal',
        reviewedBy: 'ComplianceReview',
        priority: 'medium',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['legal_001'],
      },

      // Finance Tasks
      {
        id: 'fin_001',
        department: 'Finance',
        title: 'Business Banking Setup',
        description: 'Open business bank account, merchant processing, payment gateway',
        assignedTo: 'Finance',
        reviewedBy: 'FinancialAudit',
        priority: 'critical',
        estimatedHours: 8,
        status: 'pending',
        dependencies: ['legal_001'],
      },
      {
        id: 'fin_002',
        department: 'Finance',
        title: 'Accounting System Setup',
        description: 'Chart of accounts, bookkeeping automation, QuickBooks/Xero setup',
        assignedTo: 'Finance',
        reviewedBy: 'FinancialAudit',
        priority: 'critical',
        estimatedHours: 12,
        status: 'pending',
        dependencies: ['fin_001'],
      },
      {
        id: 'fin_003',
        department: 'Finance',
        title: 'Invoicing & Payment Processing',
        description: 'Automated invoice generation, payment processing, recurring billing',
        assignedTo: 'Finance',
        reviewedBy: 'FinancialAudit',
        priority: 'high',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['fin_002'],
      },
      {
        id: 'fin_004',
        department: 'Finance',
        title: 'Financial Reporting & Dashboards',
        description: 'P&L statements, cash flow analysis, KPI dashboards, forecasting',
        assignedTo: 'Finance',
        reviewedBy: 'FinancialAudit',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['fin_002'],
      },

      // Operations Tasks
      {
        id: 'ops_001',
        department: 'Operations',
        title: 'Standard Operating Procedures',
        description: 'Document core processes, workflows, quality standards',
        assignedTo: 'Operations',
        reviewedBy: 'QualityAssurance',
        priority: 'high',
        estimatedHours: 24,
        status: 'pending',
        dependencies: [],
      },
      {
        id: 'ops_002',
        department: 'Operations',
        title: 'Customer Support Setup',
        description: 'Help desk system, knowledge base, support workflows, ticketing',
        assignedTo: 'Operations',
        reviewedBy: 'QualityAssurance',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['ops_001'],
      },
      {
        id: 'ops_003',
        department: 'Operations',
        title: 'Vendor Management System',
        description: 'Vendor relationships, contract negotiations, procurement processes',
        assignedTo: 'Operations',
        reviewedBy: 'QualityAssurance',
        priority: 'medium',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['ops_001'],
      },

      // HR Tasks
      {
        id: 'hr_001',
        department: 'HR',
        title: 'Employee Handbook & Policies',
        description: 'HR policies, code of conduct, safety procedures, employee handbook',
        assignedTo: 'HR',
        reviewedBy: 'HRCompliance',
        priority: 'high',
        estimatedHours: 20,
        status: 'pending',
        dependencies: ['legal_001'],
      },
      {
        id: 'hr_002',
        department: 'HR',
        title: 'Recruitment Process Setup',
        description: 'Job posting templates, candidate screening, interview processes',
        assignedTo: 'HR',
        reviewedBy: 'HRCompliance',
        priority: 'medium',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['hr_001'],
      },
      {
        id: 'hr_003',
        department: 'HR',
        title: 'Payroll & Benefits Administration',
        description: 'Payroll system setup, benefits management, tax withholding',
        assignedTo: 'HR',
        reviewedBy: 'HRCompliance',
        priority: 'high',
        estimatedHours: 16,
        status: 'pending',
        dependencies: ['hr_001', 'fin_002'],
      },
    ];

    // Filter by focus areas if provided
    const filteredTasks = focusAreas && focusAreas.length > 0
      ? taskList.filter(task => 
          focusAreas.some(area => 
            task.department.toLowerCase().includes(area.toLowerCase())
          )
        )
      : taskList;

    // Store tasks
    filteredTasks.forEach(task => {
      tasks.set(task.id, { ...task, businessId });
    });

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[CEO] Tasks Generated', { 
        businessId, 
        taskCount: filteredTasks.length,
        departments: [...new Set(filteredTasks.map(t => t.department))],
      });
    }

    return {
      success: true,
      taskCount: filteredTasks.length,
      tasks: filteredTasks,
      summary: {
        total: filteredTasks.length,
        byDepartment: filteredTasks.reduce((acc, task) => {
          acc[task.department] = (acc[task.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        totalEstimatedHours: filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0),
      },
      message: `Generated ${filteredTasks.length} detailed tasks across all departments. Total estimated effort: ${filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0)} hours.`,
    };
  },
});

// Request approval for plans or high-impact decisions
export const requestApproval = tool({
  name: 'requestApproval',
  description: 'Request approval from the entrepreneur for business plans, high-impact decisions, significant spending, or major milestones. Use this before proceeding with execution phase or making important decisions.',
  parameters: {
    type: 'object',
    properties: {
      approvalType: {
        type: 'string',
        enum: ['business_plan', 'task_list', 'spending', 'strategic_decision', 'milestone'],
        description: 'Type of approval being requested',
      },
      title: {
        type: 'string',
        description: 'Title of what needs approval',
      },
      description: {
        type: 'string',
        description: 'Detailed description of what is being approved',
      },
      impact: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Impact level of this decision',
      },
      estimatedCost: {
        type: 'string',
        description: 'Estimated cost if applicable (e.g., "$5,000", "N/A")',
      },
    },
    required: ['approvalType', 'title', 'description', 'impact'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { approvalType, title, description, impact, estimatedCost } = input as {
      approvalType: string;
      title: string;
      description: string;
      impact: string;
      estimatedCost?: string;
    };

    const approvalId = `approval_${Date.now()}`;
    const approval = {
      id: approvalId,
      type: approvalType,
      title,
      description,
      impact,
      estimatedCost: estimatedCost || 'N/A',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    approvalRequests.set(approvalId, approval);

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[CEO] Approval Requested', { approvalId, title, impact });
    }

    return {
      success: true,
      approvalId,
      message: `Approval request created: "${title}". Impact: ${impact}. ${estimatedCost ? `Estimated cost: ${estimatedCost}.` : ''} Waiting for entrepreneur approval to proceed.`,
      nextSteps: 'Please review and approve to continue with execution.',
    };
  },
});

// Delegate tasks to specialized department teams
export const delegateToTeam = tool({
  name: 'delegateToTeam',
  description: 'Delegate specific tasks to specialized department teams. Each team has a Producer agent and QA/Review agent for quality assurance.',
  parameters: {
    type: 'object',
    properties: {
      taskIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of task IDs to delegate',
      },
      department: {
        type: 'string',
        enum: ['Technical', 'Marketing', 'Sales', 'Legal', 'Finance', 'Operations', 'HR'],
        description: 'Department to delegate to',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Priority level for this delegation',
      },
      instructions: {
        type: 'string',
        description: 'Additional instructions or context for the team',
      },
    },
    required: ['taskIds', 'department'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { taskIds, department, priority, instructions } = input as {
      taskIds: string[];
      department: string;
      priority?: string;
      instructions?: string;
    };

    const delegatedTasks = taskIds.map(taskId => {
      const task = tasks.get(taskId);
      if (task) {
        task.status = 'in_progress';
        task.delegatedAt = new Date().toISOString();
        task.priority = priority || task.priority;
        tasks.set(taskId, task);
        return task;
      }
      return null;
    }).filter(Boolean);

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[CEO] Tasks Delegated', { 
        department, 
        taskCount: delegatedTasks.length,
        taskIds,
      });
    }

    return {
      success: true,
      delegatedCount: delegatedTasks.length,
      department,
      tasks: delegatedTasks,
      message: `Successfully delegated ${delegatedTasks.length} task(s) to ${department} team. ${instructions ? `Instructions: ${instructions}` : ''} The Producer and QA agents will work together to ensure quality.`,
    };
  },
});

// Get status of delegated tasks
export const getTaskStatus = tool({
  name: 'getTaskStatus',
  description: 'Get the current status of tasks across all departments or for a specific department.',
  parameters: {
    type: 'object',
    properties: {
      department: {
        type: 'string',
        description: 'Optional: Filter by specific department',
      },
      status: {
        type: 'string',
        enum: ['pending', 'in_progress', 'review', 'completed', 'blocked'],
        description: 'Optional: Filter by task status',
      },
    },
    required: [],
    additionalProperties: false,
  },
  execute: async (input) => {
    const { department, status } = input as {
      department?: string;
      status?: string;
    };

    let filteredTasks = Array.from(tasks.values());

    if (department) {
      filteredTasks = filteredTasks.filter(task => task.department === department);
    }

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    const summary = {
      total: filteredTasks.length,
      byStatus: filteredTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byDepartment: filteredTasks.reduce((acc, task) => {
        acc[task.department] = (acc[task.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      success: true,
      taskCount: filteredTasks.length,
      tasks: filteredTasks,
      summary,
      message: `Found ${filteredTasks.length} task(s)${department ? ` in ${department}` : ''}${status ? ` with status ${status}` : ''}.`,
    };
  },
});

// Update task progress
export const updateTaskProgress = tool({
  name: 'updateTaskProgress',
  description: 'Update the progress and status of a specific task. Use this to track completion, blockers, or changes.',
  parameters: {
    type: 'object',
    properties: {
      taskId: {
        type: 'string',
        description: 'ID of the task to update',
      },
      status: {
        type: 'string',
        enum: ['pending', 'in_progress', 'review', 'completed', 'blocked'],
        description: 'New status of the task',
      },
      notes: {
        type: 'string',
        description: 'Progress notes or updates',
      },
      blockers: {
        type: 'string',
        description: 'Any blockers or issues encountered',
      },
    },
    required: ['taskId', 'status'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { taskId, status, notes, blockers } = input as {
      taskId: string;
      status: string;
      notes?: string;
      blockers?: string;
    };

    const task = tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: `Task ${taskId} not found.`,
      };
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();
    if (notes) task.notes = notes;
    if (blockers) task.blockers = blockers;
    if (status === 'completed') task.completedAt = new Date().toISOString();

    tasks.set(taskId, task);

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb;
    if (addBreadcrumb) {
      addBreadcrumb('[CEO] Task Updated', { taskId, status, title: task.title });
    }

    return {
      success: true,
      task,
      message: `Task "${task.title}" updated to status: ${status}. ${notes ? `Notes: ${notes}` : ''}${blockers ? ` Blockers: ${blockers}` : ''}`,
    };
  },
});
