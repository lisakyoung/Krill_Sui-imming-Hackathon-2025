"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Gift,
  Home,
  Eye,
  Bell,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";

export default function AuctionResultPage() {
  const router = useRouter();
  const [bidData, setBidData] = useState<any>(null);

  useEffect(() => {
    const latestBid = localStorage.getItem("latestBid");
    if (latestBid) {
      setBidData(JSON.parse(latestBid));
    }
  }, []);

  if (!bidData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-effect rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Bid Placed Successfully!
          </motion.h1>

          <p className="text-gray-400 mb-8">
            Your bid has been submitted to {bidData.creatorName}
          </p>

          <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              Bid Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Auction</span>
                <span className="text-white">{bidData.auctionTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Bid</span>
                <span className="text-2xl font-bold gradient-text">
                  ${bidData.amount}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Perks</span>
                <span className="text-white">{bidData.perks.length} perks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Pending Review
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              What Happens Next?
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-white">Creator Review</p>
                  <p className="text-xs text-gray-400">
                    {bidData.creatorName} will review all bids when the auction
                    ends
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-white">Notification</p>
                  <p className="text-xs text-gray-400">
                    You'll be notified if your bid is accepted
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Gift className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-white">Access Granted</p>
                  <p className="text-xs text-gray-400">
                    If accepted, you'll receive your selected perks immediately
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/my-bids")}
              className="flex-1 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View All Bids</span>
            </button>
            <GlowingButton
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </GlowingButton>
          </div>

          {/* Animated celebration elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 0 }}
                animate={{
                  y: 800,
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="absolute top-0 left-1/2"
                style={{
                  width: "10px",
                  height: "10px",
                  background: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
