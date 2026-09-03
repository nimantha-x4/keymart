"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { deleteLicenseKey } from "@/app/actions/admin";

export function DeleteKeyButton({ id }: { id: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={deleteLicenseKey} className="hidden">
        <input type="hidden" name="id" value={id} />
      </form>
      <ConfirmDialog
        triggerIcon={<X className="size-3.5" />}
        triggerAriaLabel="Delete key"
        triggerVariant="ghost"
        triggerSize="icon-xs"
        title="Remove this key?"
        description="The key is deleted from stock. This only works for keys that haven't been sold."
        confirmText="Remove key"
        confirmVariant="destructive"
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </>
  );
}
