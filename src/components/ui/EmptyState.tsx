import * as React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 max-w-md mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 bg-[#F5F2EB] border border-[#E8E2D8] flex items-center justify-center text-[#B79B63] mb-5">
        <Icon className="h-6 w-6 stroke-[1.5]" />
      </div>

      <h3 className="text-xl md:text-2xl font-serif text-[#1C1B19] font-normal mb-2 tracking-wide">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-[#5A5650] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>

      {actionLabel && (
        <div>
          {actionHref ? (
            <Button asChild variant="primary" size="md">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button onClick={onAction} variant="primary" size="md">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
