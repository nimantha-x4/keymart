"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

/**
 * A confirmation / warning modal built on the shared Dialog component. The
 * caller keeps its own (hidden) form and submits it from `onConfirm`, e.g.
 * `onConfirm={() => formRef.current?.requestSubmit()}`.
 */
export function ConfirmDialog({
  triggerText,
  triggerIcon,
  triggerAriaLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerDisabled,
  title,
  description,
  confirmText = "Confirm",
  confirmVariant = "default",
  onConfirm,
}: {
  triggerText?: string;
  triggerIcon?: ReactNode;
  triggerAriaLabel?: string;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  triggerDisabled?: boolean;
  title: string;
  description: ReactNode;
  confirmText?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label={triggerAriaLabel}
        render={
          <Button
            variant={triggerVariant}
            size={triggerSize}
            disabled={triggerDisabled}
          />
        }
      >
        {triggerIcon}
        {triggerText}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" type="button" />}>
            Cancel
          </DialogClose>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
