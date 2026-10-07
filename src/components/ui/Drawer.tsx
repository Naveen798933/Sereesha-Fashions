"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  side = "right",
  className,
}) => {
  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    bottom:
      "inset-x-0 bottom-0 max-h-[85vh] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex flex-col bg-[#FAF7F2] border-[#E8E2D8] p-6 shadow-2xl transition ease-out duration-300",
            sideClasses[side],
            className
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
            <div className="space-y-1 text-left">
              {title && (
                <DialogPrimitive.Title className="text-lg md:text-xl font-serif text-[#1C1B19]">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-xs text-[#5A5650]">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="p-1.5 text-[#5A5650] hover:text-[#1C1B19] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B79B63]"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto py-4 text-left">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
