import React, { Suspense } from "react";
import { TranscriptProvider } from "./contexts/TranscriptContext";
import { EventProvider } from "./contexts/EventContext";
import { TasksProvider } from "./contexts/TasksContext";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <TranscriptProvider>
          <EventProvider>
            <TasksProvider>
              <App />
            </TasksProvider>
          </EventProvider>
        </TranscriptProvider>
      </AuthProvider>
    </Suspense>
  );
}
