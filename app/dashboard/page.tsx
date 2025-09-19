"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Sparkles,
  Clock,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  Gavel,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [portfolioValue, setPortfolioValue] = useState(12456);
  const [subscribers, setSubscribers] = useState(1234);
  const [evolutionLevel, setEvolutionLevel] = useState(23);
  const [activeVaults, setActiveVaults] = useState(8);

  useEffect(() => {
    // Load real-time data from localStorage
    const savedPortfolio = localStorage.getItem("portfolioValue");
    const savedSubs = localStorage.getItem("totalSubscribers");
    const savedVaults = localStorage.getItem("activeVaults");

    if (savedPortfolio) setPortfolioValue(parseFloat(savedPortfolio));
    if (savedSubs) setSubscribers(parseInt(savedSubs));
    if (savedVaults) setActiveVaults(parseInt(savedVaults));
  }, []);

  const revenueData = [
    { day: "Mon", revenue: 2500 },
    { day: "Tue", revenue: 1500 },
    { day: "Wed", revenue: 7500 },
    { day: "Thu", revenue: 3500 },
    { day: "Fri", revenue: 4800 },
    { day: "Sat", revenue: 3800 },
    { day: "Sun", revenue: 4200 },
  ];

  const recentActivity = [
    {
      icon: Sparkles,
      text: "Content evolved to Lv.24",
      time: "2h ago",
      color: "text-purple-400",
    },
    {
      icon: Gavel,
      text: "Won auction from Alex Rivers",
      time: "5h ago",
      color: "text-green-400",
    },
    {
      icon: Clock,
      text: "Time vault unlocked",
      time: "1d ago",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      text: "Bought 100 LUNA shares",
      time: "2d ago",
      color: "text-yellow-400",
    },
  ];

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case "portfolio":
        router.push("/portfolio-details");
        break;
      case "subscribers":
        router.push("/subscribers-details");
        break;
      case "evolution":
        router.push("/evolution-details");
        break;
      case "vaults":
        router.push("/vaults-details");
        break;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || "Demo User"}!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your content today
          </p>
        </div>

        {/* Clickable Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick("portfolio")}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/5 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">+12.5%</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              ${portfolioValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Portfolio Value</p>
            <div className="flex items-center space-x-1 text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition">
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick("subscribers")}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/5 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-green-400">+45</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {subscribers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Subscribers</p>
            <div className="flex items-center space-x-1 text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition">
              <span>Manage subscribers</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick("evolution")}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/5 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-green-400">+2</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              Lv.{evolutionLevel}
            </p>
            <p className="text-sm text-gray-400">Evolution Level</p>
            <div className="flex items-center space-x-1 text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition">
              <span>Evolution tree</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick("vaults")}
            className="glass-effect rounded-xl p-6 text-left hover:bg-white/5 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-gray-400">2 unlocking</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{activeVaults}</p>
            <p className="text-sm text-gray-400">Active Vaults</p>
            <div className="flex items-center space-x-1 text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition">
              <span>Manage vaults</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>
        </div>

        {/* Revenue Chart */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Revenue Overview
            </h2>
            <select className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div
                  className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => router.push("/activity")}
            className="w-full mt-6 py-2 text-purple-400 hover:text-purple-300 transition text-center"
          >
            View all activity →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <button
            onClick={() => router.push("/create")}
            className="glass-effect rounded-xl p-4 hover:bg-white/10 transition"
          >
            <Sparkles className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-white">Create Content</p>
          </button>

          <button
            onClick={() => router.push("/market")}
            className="glass-effect rounded-xl p-4 hover:bg-white/10 transition"
          >
            <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-white">Browse Market</p>
          </button>

          <button
            onClick={() => router.push("/vaults")}
            className="glass-effect rounded-xl p-4 hover:bg-white/10 transition"
          >
            <Clock className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-white">Create Vault</p>
          </button>

          <button
            onClick={() => router.push("/auctions")}
            className="glass-effect rounded-xl p-4 hover:bg-white/10 transition"
          >
            <Gavel className="w-6 h-6 text-orange-400 mb-2" />
            <p className="text-white">Join Auction</p>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
