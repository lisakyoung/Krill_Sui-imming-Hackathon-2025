"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Sparkles, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlowingButton } from "@/components/ui/GlowingButton";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  subscribers: number;
  stockPrice: number;
  priceChange: number;
  evolutionLevel: number;
  activeVaults: number;
}

export function CreatorCard({
  creator,
  index,
}: {
  creator: Creator;
  index: number;
}) {
  const router = useRouter();
  const isPositive = creator.priceChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="glass-effect rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
        <div className="absolute -bottom-8 left-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {creator.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
            {creator.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-12">
        <h3 className="text-lg font-semibold text-white mb-1">
          {creator.name}
        </h3>

        {/* Stock Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-white">
              ${creator.stockPrice}
            </p>
            <div
              className={`flex items-center space-x-1 text-sm ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(creator.priceChange)}%</span>
            </div>
          </div>

          <GlowingButton
            size="sm"
            onClick={() => router.push(`/creator/${creator.id}`)}
          >
            Invest
          </GlowingButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Subscribers</p>
            <p className="text-sm font-semibold text-white">
              {creator.subscribers.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Evolution</p>
            <p className="text-sm font-semibold text-white">
              Lv.{creator.evolutionLevel}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Vaults</p>
            <p className="text-sm font-semibold text-white">
              {creator.activeVaults}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/creator/${creator.id}`)}
            className="flex-1 py-2 text-sm text-center text-purple-400 hover:text-purple-300 transition"
          >
            View Profile
          </button>
          <button
            onClick={() => router.push(`/auctions`)}
            className="flex-1 py-2 text-sm text-center text-purple-400 hover:text-purple-300 transition"
          >
            Join Auction
          </button>
        </div>
      </div>
    </motion.div>
  );
}
