"use client";

import React from "react";
import {
  PlayIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon,
  DotFilledIcon,
  ArrowLeftIcon,
  PersonIcon,
  CalendarIcon,
  ClockIcon as TimeIcon,
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

interface TaskScreenProps {
  task: Task;
  onBack: () => void;
  onRunTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: Task["status"]) => void;
}

const TaskScreen: React.FC<TaskScreenProps> = ({
  task,
  onBack,
  onRunTask,
  onUpdateStatus,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircledIcon className="text-green-600 w-6 h-6" />;
      case "in_progress":
        return <PlayIcon className="text-blue-600 w-6 h-6 animate-pulse" />;
      case "review":
        return <ClockIcon className="text-yellow-600 w-6 h-6" />;
      case "blocked":
        return <CrossCircledIcon className="text-red-600 w-6 h-6" />;
      case "pending":
      default:
        return <DotFilledIcon className="text-gray-400 w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "blocked":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-200 text-red-900 border-red-400";
      case "high":
        return "bg-orange-200 text-orange-900 border-orange-400";
      case "medium":
        return "bg-yellow-200 text-yellow-900 border-yellow-400";
      case "low":
      default:
        return "bg-green-200 text-green-900 border-green-400";
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Technical: "bg-purple-100 text-purple-800 border-purple-300",
      Marketing: "bg-pink-100 text-pink-800 border-pink-300",
      Sales: "bg-blue-100 text-blue-800 border-blue-300",
      Legal: "bg-gray-100 text-gray-800 border-gray-300",
      Finance: "bg-green-100 text-green-800 border-green-300",
      Operations: "bg-yellow-100 text-yellow-800 border-yellow-300",
      HR: "bg-indigo-100 text-indigo-800 border-indigo-300",
    };
    return colors[department] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const statusOptions: Task["status"][] = [
    "pending",
    "in_progress",
    "review",
    "completed",
    "blocked",
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to Tasks</span>
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(task.status)}
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm px-3 py-1 rounded-full border ${getDepartmentColor(
                  task.department
                )}`}
              >
                {task.department}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace("_", " ").toUpperCase()}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description Section */}
        <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{task.description}</p>
        </section>

        {/* Details Grid */}
        <section className="grid grid-cols-2 gap-4">
          {/* Assigned To */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <PersonIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Assigned To</span>
            </div>
            <p className="text-gray-900 font-semibold">{task.assignedTo}</p>
          </div>

          {/* Reviewed By */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <PersonIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Reviewed By</span>
            </div>
            <p className="text-gray-900 font-semibold">{task.reviewedBy}</p>
          </div>

          {/* Estimated Time */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TimeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Estimated Time</span>
            </div>
            <p className="text-gray-900 font-semibold">
              {task.estimatedHours} hours
            </p>
          </div>

          {/* Task ID */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <span className="text-sm font-medium">Task ID</span>
            </div>
            <p className="text-gray-900 font-mono text-sm">{task.id}</p>
          </div>
        </section>

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Dependencies
            </h2>
            <div className="space-y-2">
              {task.dependencies.map((dep) => (
                <div
                  key={dep}
                  className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-200"
                >
                  <span className="font-mono text-sm">{dep}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timestamps */}
        {(task.delegatedAt || task.updatedAt || task.completedAt) && (
          <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Timeline
            </h2>
            <div className="space-y-3">
              {task.delegatedAt && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Delegated At
                    </p>
                    <p className="text-gray-900">
                      {new Date(task.delegatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {task.updatedAt && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>
                    <p className="text-gray-900">
                      {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Completed At
                    </p>
                    <p className="text-gray-900">
                      {new Date(task.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Notes */}
        {task.notes && (
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
            <p className="text-gray-700 leading-relaxed">{task.notes}</p>
          </section>
        )}

        {/* Blockers */}
        {task.blockers && (
          <section className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <CrossCircledIcon className="w-5 h-5" />
              Blockers
            </h2>
            <p className="text-red-800 leading-relaxed">{task.blockers}</p>
          </section>
        )}

        {/* Status Management */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Update Status
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(task.id, status)}
                disabled={task.status === status}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  task.status === status
                    ? getStatusColor(status) + " opacity-100"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                } disabled:cursor-not-allowed`}
              >
                {status.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Close
        </button>
        <div className="flex gap-3">
          {task.status === "pending" && (
            <button
              onClick={() => onRunTask(task.id)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <PlayIcon />
              Run Task
            </button>
          )}
          {task.status === "in_progress" && (
            <button
              onClick={() => onUpdateStatus(task.id, "review")}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <ClockIcon />
              Submit for Review
            </button>
          )}
          {task.status === "review" && (
            <button
              onClick={() => onUpdateStatus(task.id, "completed")}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <CheckCircledIcon />
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskScreen;
