"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, TrendingUp, Clock, Gavel } from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import for Three.js components to avoid SSR issues
const ThreeBackground = dynamic(
  () => import("@/components/three/ThreeBackground"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
    ),
  }
);

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Content Evolution",
      description:
        "Watch content grow and branch based on community interaction",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Creator Equity",
      description: "Invest in creators and share their success",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Vaults",
      description: "Lock content for the future with guaranteed value",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "Reverse Auctions",
      description: "Name your price for exclusive creator access",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background 3D Animation */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />
        }
      >
        <ThreeBackground />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            <span className="text-2xl font-bold text-white">Krill</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <button
              onClick={() => router.push("/explore")}
              className="text-gray-300 hover:text-white transition"
            >
              Explore
            </button>
            <button
              onClick={() => router.push("/docs")}
              className="text-gray-300 hover:text-white transition"
            >
              Docs
            </button>
            <GlowingButton onClick={() => router.push("/login")}>
              Launch App
            </GlowingButton>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-7xl font-bold mb-6">
              <span className="gradient-text">Evolving Creator</span>
              <br />
              <span className="text-white">Economy</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Invest in creators, watch content evolve, and unlock future value in
            the first truly living content ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center space-x-4"
          >
            <GlowingButton
              size="lg"
              onClick={() => router.push("/login")}
              className="group"
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </GlowingButton>

            <button
              onClick={() => router.push("/explore")}
              className="px-8 py-4 glass-effect rounded-xl text-white hover:bg-white/20 transition"
            >
              Explore Creators
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="glass-effect rounded-2xl p-8">
            <div className="text-4xl font-bold gradient-text mb-2">$0</div>
            <div className="text-gray-400">Platform Fees</div>
          </div>
          <div className="glass-effect rounded-2xl p-8">
            <div className="text-4xl font-bold gradient-text mb-2">100%</div>
            <div className="text-gray-400">Creator Owned</div>
          </div>
          <div className="glass-effect rounded-2xl p-8">
            <div className="text-4xl font-bold gradient-text mb-2">∞</div>
            <div className="text-gray-400">Evolution Possibilities</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
