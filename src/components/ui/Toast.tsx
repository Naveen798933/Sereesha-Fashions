"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

export const ToastProvider: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "!bg-[#FAF7F2] !text-[#1C1B19] !border !border-[#E8E2D8] !shadow-xl !font-sans !rounded-none !text-xs !tracking-wide",
        descriptionClassName: "!text-[#5A5650] !text-[11px]",
        actionButtonStyle: {
          backgroundColor: "#1C1B19",
          color: "#FAF7F2",
          borderRadius: "0px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "10px",
        },
        cancelButtonStyle: {
          backgroundColor: "#F5F2EB",
          color: "#1C1B19",
          borderRadius: "0px",
          border: "1px solid #E8E2D8",
          fontSize: "10px",
        },
      }}
    />
  );
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <span className="h-2 w-2 rounded-full bg-[#2D6A4F] inline-block mr-1" />,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <span className="h-2 w-2 rounded-full bg-[#9A3434] inline-block mr-1" />,
    });
  },
  info: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: <span className="h-2 w-2 rounded-full bg-[#B79B63] inline-block mr-1" />,
    });
  },
};
