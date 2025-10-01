"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, PlusCircledIcon } from "@radix-ui/react-icons";

interface NewTaskFormProps {
  onBack: () => void;
  onSubmit: (taskData: any) => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "Technical",
    priority: "medium",
    estimatedHours: 8,
    assignedTo: "Developer",
    reviewedBy: "CodeReviewer",
  });

  const departments = [
    "Technical",
    "Marketing",
    "Sales",
    "Legal",
    "Finance",
    "Operations",
    "HR",
  ];

  const priorities = ["low", "medium", "high", "critical"];

  const agentsByDepartment: Record<string, { producer: string; reviewer: string }> = {
    Technical: { producer: "Developer", reviewer: "CodeReviewer" },
    Marketing: { producer: "Marketing", reviewer: "PerformanceAnalytics" },
    Sales: { producer: "Sales", reviewer: "SalesPerformance" },
    Legal: { producer: "Legal", reviewer: "ComplianceReview" },
    Finance: { producer: "Finance", reviewer: "FinancialAudit" },
    Operations: { producer: "Operations", reviewer: "QualityAssurance" },
    HR: { producer: "HR", reviewer: "HRCompliance" },
  };

  const handleDepartmentChange = (department: string) => {
    const agents = agentsByDepartment[department];
    setFormData({
      ...formData,
      department,
      assignedTo: agents.producer,
      reviewedBy: agents.reviewer,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      id: `custom_${Date.now()}`,
      ...formData,
      status: "pending" as const,
      dependencies: [],
      createdAt: new Date().toISOString(),
    };

    onSubmit(newTask);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <PlusCircledIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Task Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Implement user authentication system"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Provide a detailed description of what needs to be done..."
            />
          </div>

          {/* Department and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Hours */}
          <div>
            <label
              htmlFor="estimatedHours"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Estimated Hours <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="estimatedHours"
              required
              min="1"
              max="1000"
              value={formData.estimatedHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedHours: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Assigned Agents (Auto-populated, Read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Auto-Assigned Agents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Assigned To (Producer)
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Reviewed By (QA)
                </label>
                <input
                  type="text"
                  value={formData.reviewedBy}
                  readOnly
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Agents are automatically assigned based on the selected department
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <PlusCircledIcon className="w-5 h-5" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskForm;
