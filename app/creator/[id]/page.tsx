"use client";

import { use } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  TrendingUp,
  Users,
  Star,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  { time: "Jan", price: 20 },
  { time: "Feb", price: 25 },
  { time: "Mar", price: 22 },
  { time: "Apr", price: 30 },
  { time: "May", price: 35 },
  { time: "Jun", price: 45 },
];

export default function CreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const creatorId = resolvedParams.id;

  // Mock creator data
  const creator = {
    id: creatorId,
    name: "Alex Rivers",
    bio: "Digital artist and content creator exploring the boundaries of Web3 creativity.",
    avatar: "/api/placeholder/200/200",
    banner: "/api/placeholder/1200/300",
    subscribers: 12500,
    stockPrice: 45.2,
    priceChange: 12.5,
    evolutionLevel: 23,
    activeVaults: 5,
    totalContent: 234,
    joined: "Jan 2024",
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Banner */}
        <div className="relative h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-6 left-6 flex items-end space-x-6">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {creator.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-bold text-white mb-2">
                {creator.name}
              </h1>
              <p className="text-gray-300">{creator.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Stock Price",
              value: `$${creator.stockPrice}`,
              change: `+${creator.priceChange}%`,
            },
            {
              label: "Subscribers",
              value: creator.subscribers.toLocaleString(),
              change: "+234",
            },
            {
              label: "Evolution Level",
              value: `Lv.${creator.evolutionLevel}`,
              change: "+2",
            },
            {
              label: "Active Vaults",
              value: creator.activeVaults,
              change: null,
            },
            {
              label: "Total Content",
              value: creator.totalContent,
              change: "+12",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-4"
            >
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              {stat.change && (
                <p className="text-xs text-green-400 mt-1">{stat.change}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Stock Performance
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#6B7280" />
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
                    dataKey="price"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actions */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <GlowingButton className="w-full">Buy Stock</GlowingButton>
              <button className="w-full py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition">
                Subscribe
              </button>
              <button className="w-full py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition">
                Join Auction
              </button>
              <button className="w-full py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition">
                View Evolution Tree
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-around">
                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs">Like</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs">Comment</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition">
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-effect rounded-xl overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Content Title #{i}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Posted 2 days ago
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>234</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>56</span>
                      </span>
                    </div>
                    <span className="text-xs text-purple-400">Level 5</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
