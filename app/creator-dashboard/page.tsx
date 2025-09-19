"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Plus,
  Settings,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  Download,
  ChevronRight,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function CreatorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    revenue: 45678,
    subscribers: 12456,
    sharePrice: 67.89,
    evolutionLevel: 45,
  });

  const earningsData = [
    { month: "Jan", earnings: 3200 },
    { month: "Feb", earnings: 4100 },
    { month: "Mar", earnings: 3800 },
    { month: "Apr", earnings: 5200 },
    { month: "May", earnings: 4900 },
    { month: "Jun", earnings: 5478 },
  ];

  const contentList = [
    {
      id: 1,
      title: "Genesis Collection",
      views: 45600,
      revenue: 1234,
      status: "active",
    },
    {
      id: 2,
      title: "Evolution Branch #1",
      views: 32100,
      revenue: 892,
      status: "active",
    },
    {
      id: 3,
      title: "Time Vault Special",
      views: 28900,
      revenue: 756,
      status: "pending",
    },
  ];

  const communityMembers = [
    {
      id: 1,
      name: "CryptoKing",
      tier: "VIP",
      joined: "2 months ago",
      value: 450,
    },
    {
      id: 2,
      name: "ArtLover",
      tier: "Premium",
      joined: "3 weeks ago",
      value: 280,
    },
    {
      id: 3,
      name: "MusicFan",
      tier: "Basic",
      joined: "1 month ago",
      value: 150,
    },
    {
      id: 4,
      name: "TechGuru",
      tier: "Premium",
      joined: "5 days ago",
      value: 320,
    },
  ];

  const handleNewContent = () => {
    router.push("/upload-content");
  };

  const handleContentClick = (contentId: number) => {
    router.push(`/content/${contentId}`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
            <p className="text-gray-400">Manage your content empire</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/settings")}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <GlowingButton onClick={handleNewContent}>
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </GlowingButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6 cursor-pointer"
            onClick={() => router.push("/earnings")}
          >
            <DollarSign className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-3xl font-bold text-white">
              ${stats.revenue.toLocaleString()}
            </p>
            <p className="text-gray-400">Total Revenue</p>
            <p className="text-xs text-green-400 mt-2">+12.5%</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6 cursor-pointer"
            onClick={() => router.push("/subscribers-details")}
          >
            <Users className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-3xl font-bold text-white">
              {stats.subscribers.toLocaleString()}
            </p>
            <p className="text-gray-400">Subscribers</p>
            <p className="text-xs text-green-400 mt-2">+234</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6 cursor-pointer"
            onClick={() => router.push("/market")}
          >
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-3xl font-bold text-white">${stats.sharePrice}</p>
            <p className="text-gray-400">Share Price</p>
            <p className="text-xs text-green-400 mt-2">+8.2%</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-effect rounded-xl p-6 cursor-pointer"
            onClick={() => router.push("/evolution-details")}
          >
            <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-3xl font-bold text-white">
              Lv.{stats.evolutionLevel}
            </p>
            <p className="text-gray-400">Evolution Level</p>
            <p className="text-xs text-green-400 mt-2">+3</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl mb-6">
          {["overview", "content", "analytics", "earnings", "community"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg capitalize transition ${
                  activeTab === tab
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-white">New views milestone</span>
                  </div>
                  <span className="text-sm text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-white">Content liked 500 times</span>
                  </div>
                  <span className="text-sm text-gray-400">5h ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-white">50 new subscribers</span>
                  </div>
                  <span className="text-sm text-gray-400">1d ago</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push("/create")}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <Plus className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-white">Create Content</p>
                </button>
                <button
                  onClick={() => router.push("/vaults")}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <Clock className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-white">Time Vaults</p>
                </button>
                <button
                  onClick={() => router.push("/analytics")}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <BarChart3 className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-white">Analytics</p>
                </button>
                <button
                  onClick={() => router.push("/community-settings")}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <Users className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-white">Community</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Content</h2>
              <button
                onClick={handleNewContent}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
              >
                Add New
              </button>
            </div>
            <div className="space-y-3">
              {contentList.map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content.id)}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">
                        {content.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>{content.views.toLocaleString()} views</span>
                        <span>${content.revenue} earned</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          content.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {content.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Performance Overview
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect rounded-xl p-4">
                <p className="text-gray-400 mb-2">Avg. View Duration</p>
                <p className="text-2xl font-bold text-white">4:32</p>
                <p className="text-xs text-green-400">+15% from last month</p>
              </div>
              <div className="glass-effect rounded-xl p-4">
                <p className="text-gray-400 mb-2">Click-through Rate</p>
                <p className="text-2xl font-bold text-white">8.7%</p>
                <p className="text-xs text-green-400">+2.3% from last month</p>
              </div>
              <div className="glass-effect rounded-xl p-4">
                <p className="text-gray-400 mb-2">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">3.2%</p>
                <p className="text-xs text-red-400">-0.5% from last month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Earnings Overview
                </h2>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                      }}
                    />
                    <Bar dataKey="earnings" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Revenue Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subscriptions</span>
                    <span className="text-white">$23,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Share Sales</span>
                    <span className="text-white">$12,890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Vaults</span>
                    <span className="text-white">$9,332</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-bold">$45,678</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Payout Schedule
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-white">Next Payout</span>
                      <span className="text-green-400">$5,234</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Processing on Jan 15
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-white">Pending</span>
                      <span className="text-yellow-400">$1,892</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Available after Jan 20
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Community Members
                </h2>
                <button
                  onClick={() => router.push("/community-settings")}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-3">
                {communityMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {member.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white">{member.name}</p>
                        <p className="text-xs text-gray-400">
                          Joined {member.joined}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          member.tier === "VIP"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : member.tier === "Premium"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {member.tier}
                      </span>
                      <p className="text-sm text-white mt-1">${member.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect rounded-xl p-4">
                <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">89%</p>
                <p className="text-sm text-gray-400">Retention Rate</p>
              </div>
              <div className="glass-effect rounded-xl p-4">
                <MessageCircle className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-sm text-gray-400">Avg. Rating</p>
              </div>
              <div className="glass-effect rounded-xl p-4">
                <Heart className="w-5 h-5 text-red-400 mb-2" />
                <p className="text-2xl font-bold text-white">92%</p>
                <p className="text-sm text-gray-400">Satisfaction</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
