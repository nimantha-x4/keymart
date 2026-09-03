"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteLicenseKey } from "@/app/actions/admin";

export function DeleteKeyButton({ id }: { id: string }) {
  return (
    <form
      action={deleteLicenseKey}
      onSubmit={(e) => {
        if (!confirm("Remove this key from stock?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon-xs"
        aria-label="Delete key"
      >
        <X className="size-3.5" />
      </Button>
    </form>
  );
}
