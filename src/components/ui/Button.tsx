"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B79B63] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#1C1B19] text-[#FAF7F2] hover:bg-[#2E2C28] active:bg-[#121110] border border-[#1C1B19] shadow-sm",
        secondary:
          "bg-[#F5F2EB] text-[#1C1B19] hover:bg-[#ECE6DA] active:bg-[#DFD8C9] border border-[#E8E2D8]",
        gold: "bg-[#B79B63] text-white hover:bg-[#A3874F] active:bg-[#8F7440] border border-[#B79B63] shadow-sm",
        outline:
          "bg-transparent text-[#1C1B19] border border-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#FAF7F2]",
        outlineGold:
          "bg-transparent text-[#B79B63] border border-[#B79B63] hover:bg-[#B79B63] hover:text-white",
        ghost: "bg-transparent text-[#1C1B19] hover:bg-[#F5F2EB] active:bg-[#EAE4D6]",
        link: "text-[#1C1B19] underline-offset-4 hover:underline p-0 h-auto normal-case tracking-normal",
      },
      size: {
        sm: "h-9 px-4 py-2 text-[11px]",
        md: "h-11 px-6 py-2.5 text-xs",
        lg: "h-13 px-8 py-3 text-xs tracking-[0.2em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>{children}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
