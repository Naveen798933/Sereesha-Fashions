"use client";

import * as React from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log client error to monitoring service
    console.error("Global Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-[#FAF7F2]">
      <ErrorState
        title="An Unexpected Disruption Occurred"
        message="We apologize for the inconvenience. Our technical concierge team has been notified. Please try reloading this section."
        onRetry={reset}
        actionLabel="Reload Page"
      />
    </div>
  );
}
