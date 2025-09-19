"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Crown,
  Star,
  Mail,
  Bell,
  Filter,
  Search,
  UserPlus,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function SubscribersDetailsPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(1234);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("totalSubscribers");
    if (saved) setSubscribers(parseInt(saved));
  }, []);

  const subscribersList = [
    {
      id: 1,
      name: "CryptoKing",
      tier: "premium",
      joined: "2 months ago",
      value: 450,
      engagement: 92,
    },
    {
      id: 2,
      name: "ArtLover",
      tier: "standard",
      joined: "3 weeks ago",
      value: 120,
      engagement: 78,
    },
    {
      id: 3,
      name: "MusicFan",
      tier: "premium",
      joined: "1 month ago",
      value: 380,
      engagement: 85,
    },
    {
      id: 4,
      name: "TechGuru",
      tier: "free",
      joined: "5 days ago",
      value: 0,
      engagement: 45,
    },
    {
      id: 5,
      name: "GameMaster",
      tier: "standard",
      joined: "2 weeks ago",
      value: 150,
      engagement: 67,
    },
  ];

  const stats = [
    {
      label: "Total Subscribers",
      value: subscribers,
      change: "+45",
      color: "text-blue-400",
    },
    {
      label: "Premium Tier",
      value: 234,
      change: "+12",
      color: "text-purple-400",
    },
    {
      label: "Engagement Rate",
      value: "78%",
      change: "+5%",
      color: "text-green-400",
    },
    {
      label: "Monthly Revenue",
      value: "$8,456",
      change: "+18%",
      color: "text-yellow-400",
    },
  ];

  const handleMessage = (subscriberId: number) => {
    toast.success("Opening messenger...");
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
                Subscriber Management
              </h1>
              <p className="text-gray-400">
                Manage and engage with your community
              </p>
            </div>
          </div>

          <GlowingButton onClick={() => toast.success("Campaign created!")}>
            <Mail className="w-4 h-4 mr-2" />
            Send Campaign
          </GlowingButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-effect rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subscribers..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Tiers</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="free">Free</option>
            </select>

            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Subscribers</h2>
          <div className="space-y-3">
            {subscribersList.map((subscriber) => (
              <div
                key={subscriber.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {subscriber.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">
                          {subscriber.name}
                        </p>
                        {subscriber.tier === "premium" && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Joined {subscriber.joined}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${subscriber.value}
                      </p>
                      <p className="text-xs text-gray-400">{subscriber.tier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {subscriber.engagement}%
                      </p>
                      <p className="text-xs text-gray-400">Engagement</p>
                    </div>
                    <button
                      onClick={() => handleMessage(subscriber.id)}
                      className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition"
                    >
                      <Mail className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
