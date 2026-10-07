"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  max?: number;
  count?: number;
  showCount?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  count,
  showCount = true,
  interactive = false,
  onChange,
  size = "sm",
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const activeValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div
        className="flex items-center gap-0.5"
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${value} out of ${max} stars`}
      >
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= activeValue;

          return (
            <button
              key={starNumber}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starNumber)}
              onMouseEnter={() => interactive && setHoverValue(starNumber)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              className={cn(
                "p-0 transition-transform duration-100",
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
                !interactive && "pointer-events-none"
              )}
              aria-label={interactive ? `Rate ${starNumber} stars` : undefined}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled ? "fill-[#B79B63] text-[#B79B63]" : "fill-transparent text-[#D8C7A5]"
                )}
              />
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className="text-[11px] text-[#8C867D] font-normal tracking-wide">
          ({count !== undefined ? count : value.toFixed(1)})
        </span>
      )}
    </div>
  );
};
