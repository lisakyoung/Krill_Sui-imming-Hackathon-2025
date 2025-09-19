"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
      secondary: "bg-white/10 text-white border border-white/20",
      ghost: "bg-transparent text-white hover:bg-white/10",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative rounded-xl font-medium transition-all duration-200",
          "hover:shadow-xl hover:shadow-purple-500/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity blur-xl" />
        )}
      </motion.button>
    );
  }
);

GlowingButton.displayName = "GlowingButton";
