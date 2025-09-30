"use client";

import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  ReloadIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";

interface Task {
  id: string;
  department: string;
  title: string;
  description: string;
  assignedTo: string;
  reviewedBy: string;
  priority: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  status: "pending" | "in_progress" | "review" | "completed" | "blocked";
  dependencies: string[];
  businessId?: string;
  delegatedAt?: string;
  updatedAt?: string;
  completedAt?: string;
  notes?: string;
  blockers?: string;
}

interface TasksViewProps {
  isExpanded: boolean;
}

const TasksView: React.FC<TasksViewProps> = ({ isExpanded }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate with localStorage or mock data
      const mockTasks = generateMockTasks();
      setTasks(mockTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Generate mock tasks for demonstration
  const generateMockTasks = (): Task[] => {
    return [
      {
        id: "tech_001",
        department: "Technical",
        title: "Repository Setup & CI/CD Pipeline",
        description:
          "Create GitHub repository, set up CI/CD with automated testing, deployment pipelines",
        assignedTo: "Developer",
        reviewedBy: "CodeReviewer",
        priority: "critical",
        estimatedHours: 8,
        status: "completed",
        dependencies: [],
      },
      {
        id: "tech_002",
        department: "Technical",
        title: "Application Architecture & Database Design",
        description:
          "Design system architecture, database schema, API structure",
        assignedTo: "Developer",
        reviewedBy: "CodeReviewer",
        priority: "critical",
        estimatedHours: 16,
        status: "in_progress",
        dependencies: ["tech_001"],
      },
      {
        id: "tech_003",
        department: "Technical",
        title: "Core Application Development",
        description:
          "Implement core features, business logic, user authentication, data models",
        assignedTo: "Developer",
        reviewedBy: "CodeReviewer",
        priority: "high",
        estimatedHours: 80,
        status: "pending",
        dependencies: ["tech_002"],
      },
      {
        id: "mkt_001",
        department: "Marketing",
        title: "Brand Identity Development",
        description:
          "Logo design, brand guidelines, color palette, visual identity",
        assignedTo: "Marketing",
        reviewedBy: "PerformanceAnalytics",
        priority: "high",
        estimatedHours: 20,
        status: "in_progress",
        dependencies: [],
      },
      {
        id: "mkt_002",
        department: "Marketing",
        title: "Website Content Creation",
        description:
          "Homepage, product pages, about us, blog posts, SEO optimization",
        assignedTo: "Marketing",
        reviewedBy: "PerformanceAnalytics",
        priority: "high",
        estimatedHours: 40,
        status: "pending",
        dependencies: ["mkt_001"],
      },
      {
        id: "sales_001",
        department: "Sales",
        title: "CRM System Setup",
        description:
          "Configure CRM, import contacts, set up pipelines, automation rules",
        assignedTo: "Sales",
        reviewedBy: "SalesPerformance",
        priority: "high",
        estimatedHours: 12,
        status: "pending",
        dependencies: [],
      },
      {
        id: "legal_001",
        department: "Legal",
        title: "Business Entity Formation",
        description: "LLC/Corp registration, EIN acquisition, state compliance",
        assignedTo: "Legal",
        reviewedBy: "ComplianceReview",
        priority: "critical",
        estimatedHours: 8,
        status: "completed",
        dependencies: [],
      },
      {
        id: "fin_001",
        department: "Finance",
        title: "Business Banking Setup",
        description:
          "Open business bank account, merchant processing, payment gateway",
        assignedTo: "Finance",
        reviewedBy: "FinancialAudit",
        priority: "critical",
        estimatedHours: 8,
        status: "in_progress",
        dependencies: ["legal_001"],
      },
      {
        id: "ops_001",
        department: "Operations",
        title: "Standard Operating Procedures",
        description: "Document core processes, workflows, quality standards",
        assignedTo: "Operations",
        reviewedBy: "QualityAssurance",
        priority: "high",
        estimatedHours: 24,
        status: "pending",
        dependencies: [],
      },
      {
        id: "hr_001",
        department: "HR",
        title: "Employee Handbook & Policies",
        description:
          "HR policies, code of conduct, safety procedures, employee handbook",
        assignedTo: "HR",
        reviewedBy: "HRCompliance",
        priority: "high",
        estimatedHours: 20,
        status: "pending",
        dependencies: ["legal_001"],
      },
    ];
  };

  const departments = [
    "all",
    "Technical",
    "Marketing",
    "Sales",
    "Legal",
    "Finance",
    "Operations",
    "HR",
  ];

  const statuses = ["all", "pending", "in_progress", "review", "completed", "blocked"];

  const filteredTasks = tasks.filter((task) => {
    const matchesDepartment =
      selectedDepartment === "all" || task.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircledIcon className="text-green-600" />;
      case "in_progress":
        return <ReloadIcon className="text-blue-600 animate-spin-slow" />;
      case "review":
        return <ClockIcon className="text-yellow-600" />;
      case "blocked":
        return <CrossCircledIcon className="text-red-600" />;
      case "pending":
      default:
        return <DotFilledIcon className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-200 text-red-900";
      case "high":
        return "bg-orange-200 text-orange-900";
      case "medium":
        return "bg-yellow-200 text-yellow-900";
      case "low":
      default:
        return "bg-green-200 text-green-900";
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Technical: "bg-purple-100 text-purple-800",
      Marketing: "bg-pink-100 text-pink-800",
      Sales: "bg-blue-100 text-blue-800",
      Legal: "bg-gray-100 text-gray-800",
      Finance: "bg-green-100 text-green-800",
      Operations: "bg-yellow-100 text-yellow-800",
      HR: "bg-indigo-100 text-indigo-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  const handleRunTask = async (taskId: string) => {
    console.log("Running task:", taskId);
    // In a real implementation, this would trigger task execution
    // For now, we'll just update the status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "in_progress" as const } : task
      )
    );
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden w-96 min-w-96">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <button
            onClick={fetchTasks}
            className="p-1 hover:bg-gray-100 rounded"
            title="Refresh tasks"
          >
            <ReloadIcon className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2 text-xs mb-3">
          <div className="text-center">
            <div className="font-semibold text-gray-600">{taskStats.total}</div>
            <div className="text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">{taskStats.pending}</div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{taskStats.in_progress}</div>
            <div className="text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{taskStats.completed}</div>
            <div className="text-gray-500">Done</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{taskStats.blocked}</div>
            <div className="text-gray-500">Blocked</div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No tasks found</p>
            <p className="text-xs mt-1">
              Tasks will appear here once the CEO generates them
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => toggleTaskExpansion(task.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {task.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getDepartmentColor(
                        task.department
                      )}`}
                    >
                      {task.department}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-3 bg-gray-50 space-y-2">
                    <div className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Reviewed By:</span>
                        <span className="font-medium">{task.reviewedBy}</span>
                      </div>
                      {task.dependencies.length > 0 && (
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Dependencies:</span>
                          <span className="font-medium">
                            {task.dependencies.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {task.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunTask(task.id);
                        }}
                        className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <PlayIcon />
                        Run Task
                      </button>
                    )}

                    {task.status === "in_progress" && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                        Task is currently in progress...
                      </div>
                    )}

                    {task.status === "completed" && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800 flex items-center gap-2">
                        <CheckCircledIcon />
                        Task completed successfully
                      </div>
                    )}

                    {task.status === "blocked" && task.blockers && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <div className="font-semibold mb-1">Blocked:</div>
                        {task.blockers}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TasksView;
