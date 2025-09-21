"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Users, Clock, Gavel } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Music", "Art", "Gaming", "Tech", "Lifestyle"];

  const creators = [
    {
      id: "1",
      name: "Alex Rivers",
      category: "Music",
      price: 45.2,
      change: 12.5,
      subscribers: 12500,
      evolutionLevel: 23,
      vaults: 5,
    },
    {
      id: "2",
      name: "Luna Park",
      category: "Art",
      price: 32.15,
      change: -5.2,
      subscribers: 8900,
      evolutionLevel: 18,
      vaults: 3,
    },
    {
      id: "3",
      name: "Dev Master",
      category: "Tech",
      price: 78.9,
      change: 23.4,
      subscribers: 15600,
      evolutionLevel: 31,
      vaults: 8,
    },
    {
      id: "4",
      name: "Art Vision",
      category: "Art",
      price: 23.45,
      change: 8.7,
      subscribers: 6700,
      evolutionLevel: 12,
      vaults: 2,
    },
  ];

  const filteredCreators =
    selectedCategory === "All"
      ? creators
      : creators.filter((c) => c.category === selectedCategory);

  const handleInvest = (creatorId: string) => {
    router.push(`/invest/${creatorId}`);
  };

  const handleViewProfile = (creatorId: string) => {
    router.push(`/creator/${creatorId}`);
  };

  const handleJoinAuction = (creatorId: string) => {
    router.push(`/auction/${creatorId}`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Creators
          </h1>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search creators..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition">
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Market Cap</p>
            <p className="text-2xl font-bold text-white">$2.4M</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-sm text-gray-400">Active Creators</p>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-sm text-gray-400">Active Vaults</p>
            <p className="text-2xl font-bold text-white">5,678</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-sm text-gray-400">Evolution Rate</p>
            <p className="text-2xl font-bold text-white">24/hr</p>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCreators.map((creator) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {creator.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {creator.name}
                    </h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {creator.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${creator.price}
                  </p>
                  <p
                    className={`text-sm ${
                      creator.change > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {creator.change > 0 ? "↑" : "↓"} {Math.abs(creator.change)}%
                  </p>
                </div>
                <button
                  onClick={() => handleInvest(creator.id)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition"
                >
                  Invest
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Subscribers</p>
                  <p className="text-white font-medium">
                    {creator.subscribers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Evolution</p>
                  <p className="text-white font-medium">
                    Lv.{creator.evolutionLevel}
                  </p>
                </div>
                <div>
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Vaults</p>
                  <p className="text-white font-medium">{creator.vaults}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewProfile(creator.id)}
                  className="flex-1 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push(`/creator/${creator.id}/subscribe`)}
                  className="flex-1 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
