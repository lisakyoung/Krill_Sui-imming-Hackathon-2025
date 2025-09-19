"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-9xl font-bold gradient-text mb-4"
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 glass-effect rounded-xl text-white hover:bg-white/10 transition flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <GlowingButton
            onClick={() => router.push("/")}
            className="flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </GlowingButton>
        </div>
      </motion.div>
    </div>
  );
}
