"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Select an option",
  value,
  defaultValue,
  onValueChange,
  options,
  error,
  helperText,
  disabled,
  className,
  id,
}) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] uppercase tracking-[0.14em] font-medium text-[#1C1B19]"
        >
          {label}
        </label>
      )}
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          className={cn(
            "flex h-11 w-full items-center justify-between border bg-white px-3.5 py-2 text-sm text-[#1C1B19] placeholder:text-[#8C867D] transition-colors duration-200 outline-none rounded-none",
            "border-[#E8E2D8] hover:border-[#D8C7A5] focus:border-[#B79B63] focus:ring-1 focus:ring-[#B79B63]",
            "disabled:cursor-not-allowed disabled:bg-[#F5F2EB] disabled:text-[#8C867D]",
            error && "border-[#9A3434] focus:border-[#9A3434] focus:ring-[#9A3434]",
            className
          )}
          aria-invalid={!!error}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-[#8C867D] opacity-75" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="relative z-50 min-w-[8rem] overflow-hidden bg-white text-[#1C1B19] shadow-md border border-[#E8E2D8] animate-in fade-in-80 rounded-none"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-[#FAF7F2] text-[#8C867D]">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center py-2.5 pl-8 pr-3 text-xs tracking-wide uppercase outline-none transition-colors",
                    "focus:bg-[#F5F2EB] focus:text-[#1C1B19] data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-3.5 w-3.5 text-[#B79B63]" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-[#FAF7F2] text-[#8C867D]">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="text-xs text-[#9A3434] tracking-wide">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#8C867D]">{helperText}</p>}
    </div>
  );
};
