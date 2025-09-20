"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Crown,
  Star,
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  Filter,
  Search,
  ChevronRight,
  DollarSign,
  Clock,
  Eye,
  Heart,
  Play,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

interface Subscription {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  tier: "basic" | "premium" | "vip";
  price: number;
  startDate: string;
  nextBilling: string;
  status: "active" | "cancelled";
  benefits: string[];
  recentContent: {
    title: string;
    views: number;
    timestamp: string;
  }[];
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "expired" | "discover">(
    "active"
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      creatorName: "Alex Rivers",
      creatorAvatar: "AR",
      tier: "premium",
      price: 15,
      startDate: "2024-11-01",
      nextBilling: "2025-02-01",
      status: "active",
      benefits: [
        "Exclusive content",
        "Early access",
        "Direct messaging",
        "Monthly NFT",
      ],
      recentContent: [
        {
          title: "Genesis Collection Drop",
          views: 45200,
          timestamp: "2 hours ago",
        },
        { title: "Behind the Scenes", views: 23100, timestamp: "1 day ago" },
      ],
    },
    {
      id: "2",
      creatorName: "Luna Park",
      creatorAvatar: "LP",
      tier: "basic",
      price: 5,
      startDate: "2024-12-15",
      nextBilling: "2025-01-15",
      status: "active",
      benefits: ["Ad-free content", "Community access"],
      recentContent: [
        { title: "New Music Video", views: 89300, timestamp: "5 hours ago" },
      ],
    },
    {
      id: "3",
      creatorName: "Dev Master",
      creatorAvatar: "DM",
      tier: "vip",
      price: 50,
      startDate: "2024-10-01",
      nextBilling: "2025-01-01",
      status: "cancelled",
      benefits: ["1-on-1 sessions", "Custom requests", "All premium perks"],
      recentContent: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");

  const handleManageSubscription = (subId: string) => {
    router.push(`/subscription-manage/${subId}`);
  };

  const handleViewCreator = (creatorName: string) => {
    router.push(`/creator/${creatorName.toLowerCase().replace(" ", "-")}`);
  };

  const handleCancelSubscription = (subId: string) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (sub) {
      setSubscriptions(
        subscriptions.map((s) =>
          s.id === subId ? { ...s, status: "cancelled" } : s
        )
      );
      toast.success(`Subscription to ${sub.creatorName} cancelled`);
    }
  };

  const handleReactivate = (subId: string) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (sub) {
      setSubscriptions(
        subscriptions.map((s) =>
          s.id === subId ? { ...s, status: "active" } : s
        )
      );
      toast.success(`Subscription to ${sub.creatorName} reactivated`);
    }
  };

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );
  const expiredSubscriptions = subscriptions.filter(
    (s) => s.status === "cancelled"
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "basic":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip":
        return <Crown className="w-4 h-4" />;
      case "premium":
        return <Star className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                My Subscriptions
              </h1>
              <p className="text-gray-400">Manage your creator subscriptions</p>
            </div>
          </div>

          <GlowingButton onClick={() => router.push("/discover")}>
            <Search className="w-4 h-4 mr-2" />
            Discover Creators
          </GlowingButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <Users className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {activeSubscriptions.length}
            </p>
            <p className="text-sm text-gray-400">Active Subscriptions</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              ${activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0)}
            </p>
            <p className="text-sm text-gray-400">Monthly Spending</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Calendar className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {
                activeSubscriptions.filter((s) => {
                  const nextDate = new Date(s.nextBilling);
                  const today = new Date();
                  const diffDays = Math.ceil(
                    (nextDate.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return diffDays <= 7;
                }).length
              }
            </p>
            <p className="text-sm text-gray-400">Renewing Soon</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {Math.round(
                activeSubscriptions.reduce(
                  (sum, sub) =>
                    sum + sub.recentContent.reduce((v, c) => v + c.views, 0),
                  0
                ) / 1000
              )}
              k
            </p>
            <p className="text-sm text-gray-400">Content Views</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-3 px-4 rounded-lg transition ${
              activeTab === "active"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active ({activeSubscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`flex-1 py-3 px-4 rounded-lg transition ${
              activeTab === "expired"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Expired ({expiredSubscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-3 px-4 rounded-lg transition ${
              activeTab === "discover"
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Discover
          </button>
        </div>

        {/* Active Subscriptions */}
        {activeTab === "active" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeSubscriptions.map((sub) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-2xl overflow-hidden"
              >
                <div className={`h-2 ${getTierColor(sub.tier)}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {sub.creatorAvatar}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">
                            {sub.creatorName}
                          </h3>
                          {getTierIcon(sub.tier)}
                        </div>
                        <p className="text-sm text-gray-400 capitalize">
                          {sub.tier} Tier
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        ${sub.price}
                      </p>
                      <p className="text-xs text-gray-400">/month</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {sub.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Content */}
                  {sub.recentContent.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Recent Content:
                      </p>
                      <div className="space-y-2">
                        {sub.recentContent.map((content, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <Play className="w-3 h-3 text-purple-400" />
                              <span className="text-sm text-white truncate">
                                {content.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>
                                  {(content.views / 1000).toFixed(1)}k
                                </span>
                              </span>
                              <span>{content.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Billing Info */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Next billing:
                      </span>
                    </div>
                    <span className="text-sm text-white">
                      {new Date(sub.nextBilling).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewCreator(sub.creatorName)}
                      className="flex-1 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleManageSubscription(sub.id)}
                      className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleCancelSubscription(sub.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Expired Subscriptions */}
        {activeTab === "expired" && (
          <div className="space-y-4">
            {expiredSubscriptions.map((sub) => (
              <div key={sub.id} className="glass-effect rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {sub.creatorAvatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-white">{sub.creatorName}</p>
                      <p className="text-sm text-gray-400">
                        Cancelled on{" "}
                        {new Date(sub.nextBilling).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReactivate(sub.id)}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                  >
                    Reactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === "discover" && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Discover New Creators
            </h2>
            <p className="text-gray-400 mb-6">
              Find creators that match your interests
            </p>
            <GlowingButton onClick={() => router.push("/discover")}>
              Browse Creators
            </GlowingButton>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
