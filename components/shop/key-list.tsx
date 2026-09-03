"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CopyKey({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-sm">
        {value}
      </code>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Copy key"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Key copied");
            setTimeout(() => setCopied(false), 1500);
          } catch {
            toast.error("Couldn't copy");
          }
        }}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}

export type KeyGroup = { productName: string; keys: string[] };

export function KeyList({ groups }: { groups: KeyGroup[] }) {
  if (groups.length === 0) {
    return null;
  }
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.productName} className="p-5">
          <div className="mb-3 font-medium">{group.productName}</div>
          <div className="space-y-2">
            {group.keys.map((k) => (
              <CopyKey key={k} value={k} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
