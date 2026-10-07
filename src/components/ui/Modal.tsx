"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[92vw] md:max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 bg-[#FAF7F2] p-6 md:p-8 shadow-2xl border border-[#E8E2D8] duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            maxWidthMap[maxWidth],
            className
          )}
        >
          <div className="flex flex-col space-y-2 mb-4 text-left">
            {title && (
              <DialogPrimitive.Title className="text-xl md:text-2xl font-serif text-[#1C1B19] tracking-wide font-normal">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="text-xs text-[#5A5650] leading-relaxed">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          <div className="relative">{children}</div>

          <DialogPrimitive.Close
            className="absolute right-4 top-4 p-1.5 text-[#5A5650] hover:text-[#1C1B19] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B79B63]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
