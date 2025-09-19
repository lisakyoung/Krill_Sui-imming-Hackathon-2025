"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  Gavel,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.name || "Creator"}!
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's happening with your content today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: TrendingUp,
              label: "Portfolio Value",
              value: "$12,456",
              change: "+12.5%",
              color: "text-green-400",
            },
            {
              icon: Users,
              label: "Total Subscribers",
              value: "1,234",
              change: "+45",
              color: "text-blue-400",
            },
            {
              icon: Sparkles,
              label: "Evolution Level",
              value: "Lv.23",
              change: "+2",
              color: "text-purple-400",
            },
            {
              icon: Clock,
              label: "Active Vaults",
              value: "8",
              change: "2 unlocking",
              color: "text-orange-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Revenue Overview
              </h2>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
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
                    dataKey="value"
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
              {[
                {
                  type: "evolution",
                  text: "Content evolved to Lv.24",
                  time: "2h ago",
                  icon: Sparkles,
                },
                {
                  type: "bid",
                  text: "Won auction from Alex Rivers",
                  time: "5h ago",
                  icon: Gavel,
                },
                {
                  type: "vault",
                  text: "Time vault unlocked",
                  time: "1d ago",
                  icon: Clock,
                },
                {
                  type: "stock",
                  text: "Bought 100 LUNA shares",
                  time: "2d ago",
                  icon: TrendingUp,
                },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition">
              View all activity →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Create Content", icon: Sparkles, href: "/create" },
            { label: "Browse Market", icon: TrendingUp, href: "/market" },
            { label: "Create Vault", icon: Clock, href: "/vaults" },
            { label: "Join Auction", icon: Gavel, href: "/auctions" },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(action.href)}
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition group"
              >
                <Icon className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-white font-medium">{action.label}</p>
                <ArrowUpRight className="w-4 h-4 text-gray-400 mt-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
