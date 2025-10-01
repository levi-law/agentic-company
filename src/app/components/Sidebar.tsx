"use client";

import React, { useState } from "react";
import {
  ChatBubbleIcon,
  PlusCircledIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  createdAt: number;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const groupConversationsByDate = () => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      Older: [],
    };

    const now = new Date();
    conversations.forEach((conv) => {
      const date = new Date(conv.timestamp);
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) groups.Today.push(conv);
      else if (days === 1) groups.Yesterday.push(conv);
      else if (days < 7) groups["Previous 7 Days"].push(conv);
      else if (days < 30) groups["Previous 30 Days"].push(conv);
      else groups.Older.push(conv);
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate();

  return (
    <div
      className={`h-full bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Conversations</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 flex items-center gap-3 transition-colors"
          title="New conversation"
        >
          <PlusCircledIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2">
        {!isCollapsed ? (
          // Expanded view with groups
          <div className="space-y-6 py-2">
            {Object.entries(groupedConversations).map(
              ([group, convs]) =>
                convs.length > 0 && (
                  <div key={group}>
                    <h3 className="text-xs font-semibold text-gray-400 px-3 mb-2">
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {convs.map((conv) => (
                        <div
                          key={conv.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredId(conv.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <button
                            onClick={() => onSelectConversation(conv.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                              currentConversationId === conv.id
                                ? "bg-gray-800 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <ChatBubbleIcon className="w-4 h-4 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {conv.title}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  {conv.lastMessage}
                                </div>
                              </div>
                            </div>
                          </button>
                          {hoveredId === conv.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors"
                              title="Delete conversation"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          // Collapsed view with icons only
          <div className="space-y-1 py-2">
            {conversations.slice(0, 10).map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center ${
                  currentConversationId === conv.id
                    ? "bg-gray-800"
                    : "hover:bg-gray-800"
                }`}
                title={conv.title}
              >
                <ChatBubbleIcon className="w-5 h-5" />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {conversations.length === 0 && !isCollapsed && (
          <div className="px-3 py-8 text-center">
            <ChatBubbleIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-sm text-gray-400">No conversations yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
