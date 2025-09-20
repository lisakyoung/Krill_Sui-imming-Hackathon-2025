"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Clock,
  Gavel,
  DollarSign,
  Activity,
  Eye,
  Heart,
  Lock,
  Plus,
  Sparkles, // This was missing!
  MessageCircle,
  BarChart3,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"creator" | "viewer">("viewer");
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalEarnings: 0,
    evolutionLevel: 1,
  });

  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    if (savedUserType) {
      setUserType(savedUserType as "creator" | "viewer");
    }
  }, []);

  const recentActivity = [
    {
      id: 1,
      icon: Sparkles,
      text: "Content evolved to Lv.24",
      time: "2h ago",
      color: "text-purple-400",
    },
    {
      id: 2,
      icon: Gavel,
      text: "Won auction from Alex Rivers",
      time: "5h ago",
      color: "text-green-400",
    },
    {
      id: 3,
      icon: Clock,
      text: "Time vault unlocked",
      time: "1d ago",
      color: "text-blue-400",
    },
    {
      id: 4,
      icon: TrendingUp,
      text: "LUNA shares up 12%",
      time: "2d ago",
      color: "text-yellow-400",
    },
  ];

  const featuredCreators = [
    { id: 1, name: "Alex Rivers", shares: 3200, change: "+12.5%" },
    { id: 2, name: "Luna Park", shares: 87, change: "-5.2%" },
    { id: 3, name: "Dev Master", shares: 93, change: "+23.4%" },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        router.push("/create");
        break;
      case "market":
        router.push("/market");
        break;
      case "auction":
        router.push("/auctions");
        break;
      case "vaults":
        router.push("/vaults");
        break;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, Creator
            </h1>
            <p className="text-gray-400">
              Your content is evolving and earning
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/portfolio-details")}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
            >
              Portfolio
            </button>
            {userType === "creator" && (
              <GlowingButton onClick={() => router.push("/creator-dashboard")}>
                Creator Studio
              </GlowingButton>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6"
          >
            <DollarSign className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-3xl font-bold text-white">$13,003</p>
            <p className="text-gray-400">Total Value</p>
            <p className="text-xs text-green-400 mt-2">+12.5%</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6"
          >
            <Activity className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-3xl font-bold text-white">24</p>
            <p className="text-gray-400">Active Positions</p>
            <p className="text-xs text-green-400 mt-2">+3</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6"
          >
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-3xl font-bold text-white">$1,847</p>
            <p className="text-gray-400">Today&apos;s Gain</p>
            <p className="text-xs text-green-400 mt-2">+8.2%</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6"
          >
            <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-3xl font-bold text-white">68%</p>
            <p className="text-gray-400">Win Rate</p>
            <p className="text-xs text-green-400 mt-2">+5%</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Recent Activity
              </h2>
              <button
                onClick={() => router.push("/activity")}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                  >
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white">{activity.text}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Creators */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Top Creators</h2>
              <button
                onClick={() => router.push("/market")}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                View market
              </button>
            </div>
            <div className="space-y-3">
              {featuredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                    <span className="text-white">{creator.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${creator.shares}</p>
                    <p
                      className={`text-xs ${creator.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                    >
                      {creator.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("create")}
            className="p-6 glass-effect rounded-2xl hover:bg-white/10 transition"
          >
            <Plus className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
            <p className="text-white font-medium">Create Content</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("market")}
            className="p-6 glass-effect rounded-2xl hover:bg-white/10 transition"
          >
            <TrendingUp className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
            <p className="text-white font-medium">Browse Market</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("auction")}
            className="p-6 glass-effect rounded-2xl hover:bg-white/10 transition"
          >
            <Gavel className="w-8 h-8 text-green-400 mb-3 mx-auto" />
            <p className="text-white font-medium">Join Auction</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("vaults")}
            className="p-6 glass-effect rounded-2xl hover:bg-white/10 transition"
          >
            <Lock className="w-8 h-8 text-orange-400 mb-3 mx-auto" />
            <p className="text-white font-medium">Time Vaults</p>
          </motion.button>
        </div>
      </div>
    </MainLayout>
  );
}
