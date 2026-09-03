"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteProduct, type FormResult } from "@/app/actions/admin";

function Inner() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Delete product
    </Button>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<FormResult, FormData>(
    deleteProduct,
    { ok: false, error: "" },
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Delete this product? This can't be undone.")) {
          e.preventDefault();
        }
      }}
      className="space-y-2"
    >
      <input type="hidden" name="id" value={id} />
      {!state.ok && state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <Inner />
    </form>
  );
}
