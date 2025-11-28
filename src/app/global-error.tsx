"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report the error to sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex max-w-md flex-col items-center gap-6 p-6 rounded-2xl border bg-card shadow-md">
          <div className="flex flex-col items-center text-center gap-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Our team has been notified.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
            <Button
              className="flex items-center gap-2"
              variant="primary"
              onClick={reset}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
