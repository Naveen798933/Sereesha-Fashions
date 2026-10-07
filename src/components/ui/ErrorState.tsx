import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error while retrieving this information. Please attempt to refresh or try again shortly.",
  onRetry,
  actionLabel = "Try Again",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 max-w-md mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 bg-[#FAF0F0] border border-[#F5D5D5] flex items-center justify-center text-[#9A3434] mb-5">
        <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
      </div>

      <h3 className="text-xl md:text-2xl font-serif text-[#1C1B19] font-normal mb-2 tracking-wide">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-[#5A5650] leading-relaxed mb-6 max-w-sm">{message}</p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="md"
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
