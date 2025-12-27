


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgentErrorCard } from "@/components/agents/AgentErrorCard"; 

interface KeywordAgentUIProps {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  onComplete: (data: any) => void;
}

export function KeywordAgentUI({ keyword, onChangeKeyword, onComplete }: KeywordAgentUIProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  async function runKeywordAgent() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/agents/keyword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err.message || "Keyword agent failed");
      }

      const data = await res.json();
      setLoading(false);

      onComplete(data);
    } catch (err: any) {
      setLoading(false);
      setError(err);
    }
  }

  return (
    <div className="space-y-4">

      {/* If error, show AgentErrorCard instead of input/button */}
      {error ? (
        <AgentErrorCard
          agentName="Keyword Agent"
          error={error}
          onRetry={runKeywordAgent}
        />
      ) : (
        <>
          <input
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value)}
            className="border px-4 py-2 rounded w-full"
            placeholder="Enter keyword..."
          />

          <Button onClick={runKeywordAgent} disabled={loading} className="mt-4">
            {loading ? "Analyzing..." : "Start with Keyword"}
          </Button>
        </>
      )}

    </div>
  );
}
