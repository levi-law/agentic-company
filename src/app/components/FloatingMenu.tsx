"use client";

import React, { useState } from "react";
import {
  ListBulletIcon,
  PlusCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

interface FloatingMenuProps {
  onTasksClick: () => void;
  onNewTaskClick: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onTasksClick,
  onNewTaskClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isExpanded ? "w-48" : "w-12"
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center justify-center border-b border-gray-200"
          title={isExpanded ? "Collapse menu" : "Expand menu"}
        >
          {isExpanded ? (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Menu Items */}
        <div className="py-2">
          {/* Tasks Link */}
          <button
            onClick={onTasksClick}
            className="w-full px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 text-left group"
            title="View Tasks"
          >
            <div className="flex-shrink-0">
              <ListBulletIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </div>
            {isExpanded && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                Tasks
              </span>
            )}
          </button>

          {/* New Task Link */}
          <button
            onClick={onNewTaskClick}
            className="w-full px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3 text-left group"
            title="Create New Task"
          >
            <div className="flex-shrink-0">
              <PlusCircledIcon className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
            </div>
            {isExpanded && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                New Task
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded state label */}
      {isExpanded && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
            Quick Menu
          </span>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;
