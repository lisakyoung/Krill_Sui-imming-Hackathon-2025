"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layouts/MainLayout";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  Gavel,
  Timer,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Star,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AuctionsPage() {
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [perks, setPerks] = useState("");
  const [filter, setFilter] = useState("all");

  const auctions = [
    {
      id: 1,
      creator: "Alex Rivers",
      title: "VIP Monthly Access",
      description:
        "Get exclusive 1-on-1 monthly video calls and early access to all content",
      minBid: 100,
      maxBid: 1000,
      currentBids: 23,
      topBid: 850,
      slots: 5,
      timeLeft: "2h 34m",
      category: "music",
      verified: true,
      perks: [
        "Monthly 1-on-1 video call",
        "Early access to new tracks",
        "Behind the scenes content",
        "Signed merchandise",
      ],
    },
    {
      id: 2,
      creator: "Luna Park",
      title: "Creative Collaboration",
      description: "Co-create content and be featured in my next project",
      minBid: 500,
      maxBid: 5000,
      currentBids: 12,
      topBid: 3200,
      slots: 2,
      timeLeft: "5h 12m",
      category: "art",
      verified: true,
      perks: [
        "Co-creation opportunity",
        "Featured credit",
        "Revenue share (10%)",
        "Creative input rights",
      ],
    },
    {
      id: 3,
      creator: "Dev Master",
      title: "Code Review & Mentorship",
      description: "Weekly code reviews and personal mentorship for 3 months",
      minBid: 200,
      maxBid: 2000,
      currentBids: 45,
      topBid: 1800,
      slots: 10,
      timeLeft: "1d 8h",
      category: "education",
      verified: false,
      perks: [
        "Weekly 1-hour sessions",
        "Code review",
        "Project guidance",
        "Career advice",
      ],
    },
  ];

  const myBids = [
    { auction: "VIP Monthly Access", bid: 650, status: "outbid", rank: 3 },
    {
      auction: "Creative Collaboration",
      bid: 2500,
      status: "winning",
      rank: 1,
    },
    {
      auction: "Code Review & Mentorship",
      bid: 1200,
      status: "winning",
      rank: 2,
    },
  ];

  const handlePlaceBid = () => {
    if (!bidAmount) {
      toast.error("Please enter a bid amount");
      return;
    }

    toast.success(`Bid placed: $${bidAmount} for ${selectedAuction?.title}`);
    setBidAmount("");
    setPerks("");
  };

  const categories = [
    { id: "all", label: "All Categories", icon: Gavel },
    { id: "music", label: "Music", icon: Award },
    { id: "art", label: "Art", icon: Star },
    { id: "education", label: "Education", icon: Users },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Reverse Auctions
          </h1>
          <p className="text-gray-400 text-lg">
            Name your price for exclusive creator access
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Gavel,
              label: "Active Auctions",
              value: "156",
              change: "+12",
            },
            {
              icon: Users,
              label: "Total Bidders",
              value: "3.2K",
              change: "+234",
            },
            {
              icon: DollarSign,
              label: "Total Bids",
              value: "$456K",
              change: "+15%",
            },
            { icon: Timer, label: "Ending Soon", value: "23", change: "Live" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-purple-400" />
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition ${
                  filter === category.id
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auctions List */}
          <div className="lg:col-span-2 space-y-6">
            {auctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition cursor-pointer"
                onClick={() => setSelectedAuction(auction)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {auction.title}
                      </h3>
                      {auction.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      by {auction.creator}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Timer className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {auction.timeLeft}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {auction.slots} slots available
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{auction.description}</p>

                {/* Perks */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {auction.perks.slice(0, 3).map((perk, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs"
                    >
                      {perk}
                    </span>
                  ))}
                  {auction.perks.length > 3 && (
                    <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs">
                      +{auction.perks.length - 3} more
                    </span>
                  )}
                </div>

                {/* Bid Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex space-x-6">
                    <div>
                      <p className="text-xs text-gray-400">Min Bid</p>
                      <p className="text-lg font-semibold text-white">
                        ${auction.minBid}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Top Bid</p>
                      <p className="text-lg font-semibold text-green-400">
                        ${auction.topBid}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Bidders</p>
                      <p className="text-lg font-semibold text-white">
                        {auction.currentBids}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition">
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Place Bid */}
            {selectedAuction && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Place Your Bid
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {selectedAuction.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {selectedAuction.creator}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bid Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: $${selectedAuction.minBid}`}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Requested Perks
                    </label>
                    <textarea
                      value={perks}
                      onChange={(e) => setPerks(e.target.value)}
                      placeholder="What would you like from this subscription?"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div className="text-xs text-yellow-400">
                        <p className="font-medium mb-1">Bidding Tips:</p>
                        <ul className="space-y-1">
                          <li>• Higher bids increase selection chance</li>
                          <li>• Creators pick winners manually</li>
                          <li>• Be specific about desired perks</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <GlowingButton onClick={handlePlaceBid} className="w-full">
                    Place Bid
                  </GlowingButton>
                </div>
              </div>
            )}

            {/* My Bids */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Active Bids
              </h3>

              <div className="space-y-3">
                {myBids.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">
                        {bid.auction}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                          ${bid.bid}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            bid.status === "winning"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Rank</p>
                      <p className="text-lg font-bold text-white">
                        #{bid.rank}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Stats
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Bids</span>
                  <span className="text-sm text-white font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Won Auctions</span>
                  <span className="text-sm text-green-400 font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Spent</span>
                  <span className="text-sm text-white font-medium">$4,350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Win Rate</span>
                  <span className="text-sm text-purple-400 font-medium">
                    25%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
