"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

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
    toast("Retrying…", { description: "Reloading this section for you." });
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-16 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="
              relative max-w-md w-full text-center
              bg-card/80 backdrop-blur-xl border border-border/60
              shadow-[0_0_35px_-10px_var(--ai-accent)]
              rounded-2xl px-8 py-10 space-y-6
            "
          >
            {/* Glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-ai-accent/10 blur-xl opacity-60 pointer-events-none"></div>

            {/* Icon */}
            <div className="
              mx-auto w-12 h-12 rounded-xl flex items-center justify-center
              bg-ai-accent/15 border border-ai-accent/20 text-ai-accent
            ">
              <TriangleAlert className="w-6 h-6" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold tracking-tight">
              Something went wrong in this section
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {this.state.error?.message ??
                "An unexpected problem occurred. You can retry safely."}
            </p>

            {/* Retry Button */}
            <Button
              onClick={this.reset}
              className="
                w-full h-9 rounded-lg gap-2
                bg-ai-accent text-white hover:bg-ai-accent/90
                shadow-[0_0_10px_-4px_var(--ai-accent)]
              "
            >
              Retry
            </Button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
            