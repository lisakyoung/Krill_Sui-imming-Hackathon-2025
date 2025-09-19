"use client";

import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Gavel,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Music,
  Palette,
  Code,
  BookOpen,
  ChevronRight,
} from "lucide-react";

export default function AuctionsPage() {
  const router = useRouter();

  const auctions = [
    {
      id: 1,
      title: "VIP Monthly Access",
      creator: "Alex Rivers",
      category: "Music",
      minBid: 100,
      topBid: 850,
      bidders: 23,
      timeLeft: "2h 34m",
      slots: 5,
      verified: true,
    },
    {
      id: 2,
      title: "Art Mentorship Program",
      creator: "Luna Park",
      category: "Art",
      minBid: 150,
      topBid: 620,
      bidders: 18,
      timeLeft: "5h 12m",
      slots: 3,
      verified: true,
    },
    {
      id: 3,
      title: "Code Review Sessions",
      creator: "Code Ninja",
      category: "Education",
      minBid: 80,
      topBid: 320,
      bidders: 12,
      timeLeft: "1d 8h",
      slots: 10,
      verified: false,
    },
  ];

  const categories = [
    { name: "All Categories", icon: Gavel, active: true },
    { name: "Music", icon: Music, active: false },
    { name: "Art", icon: Palette, active: false },
    { name: "Education", icon: BookOpen, active: false },
  ];

  const handleAuctionClick = (auctionId: number) => {
    // Navigate to specific auction page
    router.push(`/auction/${auctionId}`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Reverse Auctions
          </h1>
          <p className="text-gray-400">
            Name your price for exclusive creator access
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Gavel className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-green-400">+12</span>
            </div>
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-sm text-gray-400">Active Auctions</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-green-400">+234</span>
            </div>
            <p className="text-2xl font-bold text-white">3.2K</p>
            <p className="text-sm text-gray-400">Total Bidders</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">+15%</span>
            </div>
            <p className="text-2xl font-bold text-white">$456K</p>
            <p className="text-sm text-gray-400">Total Bids</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-yellow-400">Live</span>
            </div>
            <p className="text-2xl font-bold text-white">23</p>
            <p className="text-sm text-gray-400">Ending Soon</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                category.active
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Auctions List */}
        <div className="space-y-4">
          {auctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAuctionClick(auction.id)}
              className="glass-effect rounded-xl p-6 hover:bg-white/5 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {auction.title}
                    </h3>
                    {auction.verified && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 mb-4">by {auction.creator}</p>

                  <p className="text-gray-300 mb-4">
                    Get exclusive 1-on-1 monthly video calls and early access to
                    all content
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      Monthly 1-on-1 video call
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      Early access to new tracks
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      Behind the scenes content
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      +1 more
                    </span>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-xs text-gray-400">Min Bid</p>
                      <p className="text-lg font-bold text-white">
                        ${auction.minBid}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Top Bid</p>
                      <p className="text-lg font-bold text-green-400">
                        ${auction.topBid}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Bidders</p>
                      <p className="text-lg font-bold text-white">
                        {auction.bidders}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="flex items-center space-x-2 text-orange-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{auction.timeLeft}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    {auction.slots} slots available
                  </p>

                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition">
                    <span className="mr-1">View Auction</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
