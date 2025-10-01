"use client";

import React, { createContext, useContext, useState, FC, PropsWithChildren } from "react";

export interface Task {
  id: string;
  department: string;
  title: string;
  description: string;
  assignedTo: string;
  reviewedBy: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependencies: string[];
  progress?: number;
  blockers?: string;
}

type TasksContextValue = {
  tasks: Task[];
  addTasks: (newTasks: Task[]) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], progress?: number, blockers?: string) => void;
  clearTasks: () => void;
  getTaskById: (taskId: string) => Task | undefined;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTasks = (newTasks: Task[]) => {
    setTasks((prev) => {
      // Merge tasks, replacing existing ones with same ID
      const taskMap = new Map(prev.map(t => [t.id, t]));
      newTasks.forEach(task => taskMap.set(task.id, task));
      return Array.from(taskMap.values());
    });
  };

  const updateTaskStatus = (taskId: string, status: Task['status'], progress?: number, blockers?: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status, progress, blockers }
          : task
      )
    );
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId);
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTasks, updateTaskStatus, clearTasks, getTaskById }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
