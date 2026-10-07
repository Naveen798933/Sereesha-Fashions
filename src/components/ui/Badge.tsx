import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center uppercase font-medium tracking-[0.14em] transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-[#1C1B19] text-[#FAF7F2]",
        gold: "bg-[#F7F3EB] text-[#B79B63] border border-[#D8C7A5]",
        goldSolid: "bg-[#B79B63] text-white",
        outline: "bg-transparent text-[#1C1B19] border border-[#E8E2D8]",
        sale: "bg-[#9A3434] text-white",
        success: "bg-[#2D6A4F] text-white",
        subtle: "bg-[#F5F2EB] text-[#5A5650] border border-[#E8E2D8]",
      },
      size: {
        sm: "px-2 py-0.5 text-[9px]",
        md: "px-2.5 py-1 text-[10px]",
        lg: "px-3 py-1.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}
