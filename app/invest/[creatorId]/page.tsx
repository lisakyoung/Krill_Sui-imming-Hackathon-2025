"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Info,
  ArrowLeft,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InvestPage() {
  const router = useRouter();
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [amount, setAmount] = useState(10);
  const [investmentType, setInvestmentType] = useState<"shares" | "direct">(
    "shares"
  );

  // Mock creator data
  const creator = {
    name: creatorId === "1" ? "Alex Rivers" : "Luna Park",
    symbol: creatorId === "1" ? "ALEX" : "LUNA",
    currentPrice: creatorId === "1" ? 54.7 : 32.15,
    change24h: creatorId === "1" ? 12.5 : 5.2,
    availableShares: 4900,
    marketCap: 547000,
    holders: 1234,
  };

  const priceHistory = [
    { time: "Jan", price: 20 },
    { time: "Feb", price: 25 },
    { time: "Mar", price: 32 },
    { time: "Apr", price: 38 },
    { time: "May", price: 45 },
    { time: "Jun", price: creator.currentPrice },
  ];

  const handleInvest = () => {
    const total = amount * creator.currentPrice;

    // Store investment in localStorage for persistence
    const existingInvestments = JSON.parse(
      localStorage.getItem("userInvestments") || "[]"
    );
    const newInvestment = {
      id: Date.now(),
      creatorId,
      creatorName: creator.name,
      shares: amount,
      price: creator.currentPrice,
      total,
      date: new Date().toISOString(),
      type: investmentType,
    };
    existingInvestments.push(newInvestment);
    localStorage.setItem(
      "userInvestments",
      JSON.stringify(existingInvestments)
    );

    // Update portfolio value
    const currentPortfolio = parseFloat(
      localStorage.getItem("portfolioValue") || "12456"
    );
    localStorage.setItem(
      "portfolioValue",
      (currentPortfolio + total).toString()
    );

    toast.success(
      `Successfully invested $${total.toFixed(2)} in ${creator.name}!`
    );
    router.push("/portfolio");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="glass-effect rounded-2xl p-8 mb-6">
          {/* Creator Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {creator.name[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {creator.name}
                </h1>
                <p className="text-gray-400">Symbol: {creator.symbol}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                ${creator.currentPrice}
              </p>
              <p
                className={`flex items-center justify-end space-x-1 ${
                  creator.change24h > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {creator.change24h > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(creator.change24h)}%</span>
              </p>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Price History
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
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

          {/* Rest of the component remains the same... */}
          {/* Investment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-3">
              Investment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInvestmentType("shares")}
                className={`p-4 rounded-xl border transition ${
                  investmentType === "shares"
                    ? "bg-purple-500/20 border-purple-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <DollarSign className="w-5 h-5 mb-2" />
                <p className="font-medium">Buy Shares</p>
                <p className="text-xs mt-1">Own part of the creator</p>
              </button>

              <button
                onClick={() => setInvestmentType("direct")}
                className={`p-4 rounded-xl border transition ${
                  investmentType === "direct"
                    ? "bg-purple-500/20 border-purple-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <TrendingUp className="w-5 h-5 mb-2" />
                <p className="font-medium">Direct Support</p>
                <p className="text-xs mt-1">One-time contribution</p>
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-3">
              Number of Shares
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => amount > 1 && setAmount(amount - 1)}
                className="w-12 h-12 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center justify-center"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-bold focus:outline-none focus:border-purple-500"
              />

              <button
                onClick={() => setAmount(amount + 1)}
                className="w-12 h-12 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex justify-between mt-4">
              {[10, 50, 100, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-white"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Investment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Price per share</span>
                <span className="text-white">${creator.currentPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Number of shares</span>
                <span className="text-white">{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform fee (0%)</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-semibold">
                  Total Investment
                </span>
                <span className="text-2xl font-bold gradient-text">
                  ${(amount * creator.currentPrice).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <GlowingButton onClick={handleInvest} className="flex-1">
              Confirm Investment
            </GlowingButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
