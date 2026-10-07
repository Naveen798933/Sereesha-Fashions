"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  label?: string | React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, error, id, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-start space-x-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "peer h-4 w-4 shrink-0 mt-0.5 rounded-none border border-[#8C867D] bg-white transition-colors duration-150 outline-none cursor-pointer",
            "focus-visible:ring-1 focus-visible:ring-[#B79B63] focus-visible:ring-offset-1",
            "data-[state=checked]:bg-[#1C1B19] data-[state=checked]:text-[#FAF7F2] data-[state=checked]:border-[#1C1B19]",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error && "border-[#9A3434]",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-3 w-3 stroke-[2.5]" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {(label || description) && (
          <div className="grid gap-1 leading-none select-none">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-xs uppercase tracking-[0.1em] font-medium text-[#1C1B19] cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-[#8C867D]">{description}</p>}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#9A3434] pl-7">{error}</p>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
