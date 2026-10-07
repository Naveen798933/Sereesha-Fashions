"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="flex-1 w-full"
    >
      {children}
    </motion.main>
  );
};
