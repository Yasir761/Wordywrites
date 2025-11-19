"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

export class LocalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  reset = () => {
    toast("Retrying...", { description: "Reloading the component." });
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 flex flex-col items-center justify-center text-center gap-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600">
            Something went wrong in this section.
          </h2>
          <p className="text-muted-foreground max-w-md">
            {this.state.error?.message || "Unexpected error occurred."}
          </p>

          <Button onClick={this.reset} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
