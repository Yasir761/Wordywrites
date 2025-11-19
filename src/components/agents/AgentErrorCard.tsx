"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

interface AgentErrorCardProps {
  agentName: string; 
  error?: any;
  onRetry: () => void;
}

export function AgentErrorCard({ agentName, error, onRetry }: AgentErrorCardProps) {
  
  const handleRetry = () => {
    toast(`Retrying ${agentName}...`, {
      description: "Please wait while we regenerate the result.",
    });

    try {
      onRetry();
    } catch (err) {
      Sentry.captureException(err);
      toast.error(`${agentName} failed again.`, {
        description: "Please try again or contact support.",
      });
    }
  };

  useEffect(() => {
    if (error) Sentry.captureException(error);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-red-300/40 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2">
          <Bug className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-600 text-lg">
            {agentName} Error
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              {error?.message || "Something went wrong while processing this step."}
            </p>
          </div>

          <div className="flex gap-3 pt-3">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry {agentName}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
