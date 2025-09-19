"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          "bg-gradient-to-r",
          gradient
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
      <div
        className={cn(
          "mt-4 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full",
          "bg-gradient-to-r",
          gradient
        )}
      />
    </motion.div>
  );
}
