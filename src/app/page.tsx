import React, { Suspense } from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import { TasksProvider } from "@/app/contexts/TasksContext";
import App from "./App";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptProvider>
        <EventProvider>
          <TasksProvider>
            <App />
          </TasksProvider>
        </EventProvider>
      </TranscriptProvider>
    </Suspense>
  );
}
