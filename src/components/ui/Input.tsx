"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] uppercase tracking-[0.14em] font-medium text-[#1C1B19]"
          >
            {label}
            {props.required && <span className="text-[#9A3434] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#8C867D]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3.5 bg-white text-[#1C1B19] text-sm placeholder:text-[#8C867D] border transition-colors duration-200 outline-none rounded-none",
              "border-[#E8E2D8] hover:border-[#D8C7A5] focus:border-[#B79B63] focus:ring-1 focus:ring-[#B79B63]",
              "disabled:bg-[#F5F2EB] disabled:text-[#8C867D] disabled:border-[#E8E2D8] disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#9A3434] focus:border-[#9A3434] focus:ring-[#9A3434]",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#8C867D]">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[#9A3434] font-normal tracking-wide">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#8C867D]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
