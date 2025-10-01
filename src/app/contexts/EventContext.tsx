"use client";

import React, { createContext, useContext, useState, useRef, FC, PropsWithChildren } from "react";
import { v4 as uuidv4 } from "uuid";
import { LoggedEvent } from "@/app/types";

type EventContextValue = {
  loggedEvents: LoggedEvent[];
  logClientEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logServerEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logHistoryItem: (item: any) => void;
  toggleExpand: (id: number | string) => void;
  onTasksGenerated?: (callback: (tasks: any[]) => void) => void;
  setSaveEventCallback?: (callback: (direction: 'client' | 'server', eventName: string, eventData: any) => void) => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export const EventProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);
  const onTasksGeneratedCallbackRef = useRef<((tasks: any[]) => void) | undefined>(undefined);
  const saveEventCallbackRef = useRef<((direction: 'client' | 'server', eventName: string, eventData: any) => void) | undefined>(undefined);

  function addLoggedEvent(direction: "client" | "server", eventName: string, eventData: Record<string, any>) {
    const id = eventData.event_id || uuidv4();
    
    // Check if this is a generateTasks function call result
    if (direction === "server" && 
        eventData.type === "function_call" && 
        eventData.name === "generateTasks" &&
        eventData.status === "done" &&
        eventData.output?.tasks) {
      // Notify about tasks being generated
      if (onTasksGeneratedCallbackRef.current) {
        onTasksGeneratedCallbackRef.current(eventData.output.tasks);
      }
    }
    
    // Save to database if callback is set
    if (saveEventCallbackRef.current) {
      saveEventCallbackRef.current(direction, eventName, eventData);
    }
    
    setLoggedEvents((prev) => [
      ...prev,
      {
        id,
        direction,
        eventName,
        eventData,
        timestamp: new Date().toLocaleTimeString(),
        expanded: false,
      },
    ]);
  }

  const logClientEvent: EventContextValue["logClientEvent"] = (eventObj, eventNameSuffix = "") => {
    const name = `${eventObj.type || ""} ${eventNameSuffix || ""}`.trim();
    addLoggedEvent("client", name, eventObj);
  };

  const logServerEvent: EventContextValue["logServerEvent"] = (eventObj, eventNameSuffix = "") => {
    const name = `${eventObj.type || ""} ${eventNameSuffix || ""}`.trim();
    addLoggedEvent("server", name, eventObj);
  };

  const logHistoryItem: EventContextValue['logHistoryItem'] = (item) => {
    let eventName = item.type;
    if (item.type === 'message') {
      eventName = `${item.role}.${item.status}`;
    }
    if (item.type === 'function_call') {
      eventName = `function.${item.name}.${item.status}`;
    }
    addLoggedEvent('server', eventName, item);
  };

  const toggleExpand: EventContextValue['toggleExpand'] = (id) => {
    setLoggedEvents((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          return { ...log, expanded: !log.expanded };
        }
        return log;
      })
    );
  };


  const registerTasksCallback = (callback: (tasks: any[]) => void) => {
    onTasksGeneratedCallbackRef.current = callback;
  };

  const setSaveEventCallback = (callback: (direction: 'client' | 'server', eventName: string, eventData: any) => void) => {
    saveEventCallbackRef.current = callback;
  };

  return (
    <EventContext.Provider
      value={{ 
        loggedEvents, 
        logClientEvent, 
        logServerEvent, 
        logHistoryItem, 
        toggleExpand,
        onTasksGenerated: registerTasksCallback,
        setSaveEventCallback,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}