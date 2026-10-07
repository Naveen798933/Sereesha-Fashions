"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  className,
}) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-[#E8E2D8] bg-white h-11",
        disabled && "opacity-50 pointer-events-none bg-[#F5F2EB]",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        aria-label="Decrease quantity"
        className="w-10 h-full flex items-center justify-center text-[#1C1B19] hover:bg-[#FAF7F2] active:bg-[#ECE6DA] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <div className="w-12 h-full flex items-center justify-center text-xs font-medium text-[#1C1B19] select-none border-x border-[#E8E2D8]">
        {value}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        aria-label="Increase quantity"
        className="w-10 h-full flex items-center justify-center text-[#1C1B19] hover:bg-[#FAF7F2] active:bg-[#ECE6DA] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
