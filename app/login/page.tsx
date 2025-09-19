"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Simulate login for now
      setTimeout(() => {
        login({
          userAddress: "0x1234...5678",
          email: "demo@example.com",
          name: "Demo User",
        });
        toast.success("Welcome to Krill!");
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Krill
          </h1>
          <p className="text-gray-400">The Living Creator Economy</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-3xl p-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sign in to continue
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FcGoogle className="w-6 h-6" />
                  <span className="font-medium">Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-950 text-gray-400">
                  Powered by zkLogin
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "No passwords needed",
                "Your keys, your content",
                "Instant access to Web3",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
