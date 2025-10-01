"use client";

import React, { useState } from "react";
import { useTasks, Task } from "@/app/contexts/TasksContext";

export interface TasksProps {
  isExpanded: boolean;
}

function Tasks({ isExpanded }: TasksProps) {
  const { tasks } = useTasks();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Get unique departments
  const departments = ["all", ...Array.from(new Set(tasks.map(t => t.department)))];

  // Filter tasks by department
  const filteredTasks = selectedDepartment === "all" 
    ? tasks 
    : tasks.filter(t => t.department === selectedDepartment);

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    blocked: filteredTasks.filter(t => t.status === 'blocked'),
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-200 text-gray-700';
      case 'in_progress': return 'bg-blue-200 text-blue-700';
      case 'completed': return 'bg-green-200 text-green-700';
      case 'blocked': return 'bg-red-200 text-red-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 font-bold';
      case 'high': return 'text-orange-600 font-semibold';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleExecuteTask = (taskId: string) => {
    // This will be handled by the agent - we just show a visual indicator
    console.log(`Execute task: ${taskId}`);
    // In a real implementation, this would trigger the agent to execute the task
  };

  return (
    <div
      className={
        (isExpanded ? "w-1/2 overflow-auto" : "w-0 overflow-hidden opacity-0") +
        " transition-all rounded-xl duration-200 ease-in-out flex flex-col bg-white"
      }
    >
      {isExpanded && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 sticky top-0 z-10 text-base border-b bg-white rounded-t-xl">
            <span className="font-semibold">Tasks ({tasks.length})</span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Department:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No tasks yet. Generate tasks to see them here.
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Pending Tasks */}
                {tasksByStatus.pending.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Pending ({tasksByStatus.pending.length})
                    </h3>
                    <div className="space-y-2">
                      {tasksByStatus.pending.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onExecute={handleExecuteTask}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Tasks */}
                {tasksByStatus.in_progress.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      In Progress ({tasksByStatus.in_progress.length})
                    </h3>
                    <div className="space-y-2">
                      {tasksByStatus.in_progress.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onExecute={handleExecuteTask}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Blocked Tasks */}
                {tasksByStatus.blocked.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      Blocked ({tasksByStatus.blocked.length})
                    </h3>
                    <div className="space-y-2">
                      {tasksByStatus.blocked.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onExecute={handleExecuteTask}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Tasks */}
                {tasksByStatus.completed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Completed ({tasksByStatus.completed.length})
                    </h3>
                    <div className="space-y-2">
                      {tasksByStatus.completed.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onExecute={handleExecuteTask}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onExecute: (taskId: string) => void;
  getStatusColor: (status: Task['status']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
}

function TaskCard({ task, isExpanded, onToggleExpand, onExecute, getStatusColor, getPriorityColor }: TaskCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onToggleExpand}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h4 className="text-sm font-semibold text-gray-800 truncate flex-1">{task.title}</h4>
          </div>
          
          <div className="flex items-center gap-2 ml-6 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              {task.department}
            </span>
            <span className="text-xs text-gray-500">
              {task.estimatedHours}h
            </span>
          </div>

          {isExpanded && (
            <div className="ml-6 space-y-2 text-sm">
              <p className="text-gray-700">{task.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Assigned to:</span>
                  <span className="ml-1 text-gray-700">{task.assignedTo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Reviewed by:</span>
                  <span className="ml-1 text-gray-700">{task.reviewedBy}</span>
                </div>
              </div>

              {task.dependencies.length > 0 && (
                <div className="text-xs">
                  <span className="text-gray-500">Dependencies:</span>
                  <span className="ml-1 text-gray-700">{task.dependencies.join(', ')}</span>
                </div>
              )}

              {task.progress !== undefined && (
                <div className="text-xs">
                  <span className="text-gray-500">Progress:</span>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700 ml-1">{task.progress}%</span>
                </div>
              )}

              {task.blockers && (
                <div className="text-xs">
                  <span className="text-red-600">Blockers:</span>
                  <span className="ml-1 text-gray-700">{task.blockers}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {task.status === 'pending' && (
          <button
            onClick={() => onExecute(task.id)}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors whitespace-nowrap"
          >
            Execute
          </button>
        )}
      </div>
    </div>
  );
}

export default Tasks;
