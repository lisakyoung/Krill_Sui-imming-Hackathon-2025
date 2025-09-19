"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Clock, Users, Star } from "lucide-react";
import { CreatorCard } from "@/components/features/CreatorCard";
import { CategoryFilter } from "@/components/features/CategoryFilter";
import MainLayout from "@/components/layouts/MainLayout";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const creators = [
    {
      id: "1",
      name: "Alex Rivers",
      avatar: "/avatars/1.jpg",
      category: "Music",
      subscribers: 12500,
      stockPrice: 45.2,
      priceChange: 12.5,
      evolutionLevel: 23,
      activeVaults: 5,
    },
    {
      id: "2",
      name: "Luna Park",
      avatar: "/avatars/2.jpg",
      category: "Art",
      subscribers: 8900,
      stockPrice: 32.15,
      priceChange: -5.2,
      evolutionLevel: 18,
      activeVaults: 3,
    },
    {
      id: "3",
      name: "Dev Master",
      avatar: "/avatars/3.jpg",
      category: "Tech",
      subscribers: 15600,
      stockPrice: 78.9,
      priceChange: 23.4,
      evolutionLevel: 31,
      activeVaults: 8,
    },
    {
      id: "4",
      name: "Art Vision",
      avatar: "/avatars/4.jpg",
      category: "Art",
      subscribers: 6700,
      stockPrice: 23.45,
      priceChange: 8.7,
      evolutionLevel: 12,
      activeVaults: 2,
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="glass-effect border-b border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                Explore Creators
              </h1>

              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creators..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <button className="p-2 glass-effect rounded-xl hover:bg-white/10 transition">
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Stats Bar */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "Total Market Cap", value: "$2.4M" },
              { icon: Users, label: "Active Creators", value: "1,234" },
              { icon: Clock, label: "Active Vaults", value: "5,678" },
              { icon: Star, label: "Evolution Rate", value: "24/hr" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <stat.icon className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-white text-lg font-semibold">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creators
              .filter(
                (creator) =>
                  selectedCategory === "all" ||
                  creator.category.toLowerCase() === selectedCategory
              )
              .filter((creator) =>
                creator.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((creator, index) => (
                <CreatorCard key={creator.id} creator={creator} index={index} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
