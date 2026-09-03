"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Mail, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resendOrderEmail,
  updateOrderStatus,
  type FormResult,
} from "@/app/actions/admin";

const INITIAL: FormResult = { ok: false, error: "" };

function Pending({
  idle,
  icon,
}: {
  idle: string;
  icon: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
      {idle}
    </>
  );
}

function Result({ state }: { state: FormResult }) {
  if (state.ok && state.message) {
    return (
      <Alert className="mt-2">
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }
  if (!state.ok && state.error) {
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  return null;
}

export function OrderActions({
  orderNumber,
  status,
}: {
  orderNumber: string;
  status: string;
}) {
  const [resendState, resendAction] = useActionState<FormResult, FormData>(
    (_p, fd) => resendOrderEmail(fd),
    INITIAL,
  );
  const [statusState, statusAction] = useActionState<FormResult, FormData>(
    (_p, fd) => updateOrderStatus(fd),
    INITIAL,
  );

  return (
    <div className="space-y-4">
      {status === "FULFILLED" && (
        <form action={resendAction}>
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <Button type="submit" variant="outline" size="sm">
            <Pending idle="Resend keys email" icon={<Mail className="size-4" />} />
          </Button>
          <Result state={resendState} />
        </form>
      )}

      {status === "PENDING" && (
        <form action={statusAction}>
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <input type="hidden" name="action" value="cancel" />
          <Button type="submit" variant="outline" size="sm">
            <Pending
              idle="Cancel & release keys"
              icon={<XCircle className="size-4" />}
            />
          </Button>
        </form>
      )}

      {(status === "FULFILLED" || status === "PAID") && (
        <form
          action={statusAction}
          onSubmit={(e) => {
            if (!confirm("Mark this order as refunded?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <input type="hidden" name="action" value="refund" />
          <Button type="submit" variant="destructive" size="sm">
            <Pending idle="Mark refunded" icon={<RotateCcw className="size-4" />} />
          </Button>
        </form>
      )}

      <Result state={statusState} />
    </div>
  );
}
