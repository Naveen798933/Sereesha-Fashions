import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "none" | "sm" | "full";
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded = "none", ...props }) => {
  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-xs",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={cn("animate-pulse bg-[#EFE8DD] relative overflow-hidden", roundedClass, className)}
      {...props}
    />
  );
};
