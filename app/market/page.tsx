"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layouts/MainLayout";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

// Mock chart data
const chartData = [
  { time: "00:00", price: 45.2 },
  { time: "04:00", price: 46.8 },
  { time: "08:00", price: 44.5 },
  { time: "12:00", price: 48.2 },
  { time: "16:00", price: 52.1 },
  { time: "20:00", price: 51.3 },
  { time: "24:00", price: 54.7 },
];

const orderBookData = {
  bids: [
    { price: 54.5, amount: 1250, total: 68125 },
    { price: 54.45, amount: 890, total: 48460 },
    { price: 54.4, amount: 2100, total: 114240 },
    { price: 54.35, amount: 450, total: 24457 },
    { price: 54.3, amount: 3200, total: 173760 },
  ],
  asks: [
    { price: 54.75, amount: 980, total: 53655 },
    { price: 54.8, amount: 1500, total: 82200 },
    { price: 54.85, amount: 750, total: 41137 },
    { price: 54.9, amount: 2300, total: 126270 },
    { price: 54.95, amount: 890, total: 48905 },
  ],
};

export default function MarketPage() {
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");

  const creators = [
    {
      id: 1,
      name: "Alex Rivers",
      symbol: "ALEX",
      price: 54.7,
      change24h: 12.5,
      volume24h: 1234567,
      marketCap: 5470000,
      holders: 1234,
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
    {
      id: 2,
      name: "Luna Park",
      symbol: "LUNA",
      price: 32.15,
      change24h: -5.2,
      volume24h: 890123,
      marketCap: 3215000,
      holders: 892,
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
    {
      id: 3,
      name: "Dev Master",
      symbol: "DEVM",
      price: 78.9,
      change24h: 23.4,
      volume24h: 2345678,
      marketCap: 7890000,
      holders: 2341,
      avatar: "/api/placeholder/40/40",
      verified: false,
    },
    {
      id: 4,
      name: "Art Vision",
      symbol: "ARTV",
      price: 12.34,
      change24h: 3.2,
      volume24h: 456789,
      marketCap: 1234000,
      holders: 567,
      avatar: "/api/placeholder/40/40",
      verified: true,
    },
  ];

  const handleTrade = () => {
    if (!amount || !price) {
      toast.error("Please enter amount and price");
      return;
    }

    const total = parseFloat(amount) * parseFloat(price);
    toast.success(
      `${orderType === "buy" ? "Buy" : "Sell"} order placed: ${amount} shares at $${price} (Total: $${total.toFixed(2)})`
    );
    setAmount("");
    setPrice("");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Creator Stock Market
            </h1>
            <p className="text-gray-400 text-lg">
              Invest in your favorite creators and share their success
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Market Cap</p>
              <p className="text-2xl font-bold text-white">$18.2M</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">24h Volume</p>
              <p className="text-2xl font-bold text-green-400">$2.4M</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <button className="px-6 py-3 glass-effect rounded-xl hover:bg-white/10 transition flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white" />
            <span className="text-white">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Table */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">
                  Top Creators
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm text-gray-400 font-medium">
                        Creator
                      </th>
                      <th className="text-right p-4 text-sm text-gray-400 font-medium">
                        Price
                      </th>
                      <th className="text-right p-4 text-sm text-gray-400 font-medium">
                        24h %
                      </th>
                      <th className="text-right p-4 text-sm text-gray-400 font-medium">
                        Volume
                      </th>
                      <th className="text-right p-4 text-sm text-gray-400 font-medium">
                        Market Cap
                      </th>
                      <th className="text-center p-4 text-sm text-gray-400 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {creators.map((creator) => {
                      const isPositive = creator.change24h > 0;
                      return (
                        <tr
                          key={creator.id}
                          className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                          onClick={() => setSelectedCreator(creator)}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {creator.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-1">
                                  <p className="text-white font-medium">
                                    {creator.name}
                                  </p>
                                  {creator.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">
                                        ✓
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">
                                  {creator.symbol}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-white font-medium">
                              ${creator.price.toFixed(2)}
                            </p>
                          </td>
                          <td className="p-4 text-right">
                            <div
                              className={`flex items-center justify-end space-x-1 ${
                                isPositive ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              <span>{Math.abs(creator.change24h)}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-gray-300">
                              ${(creator.volume24h / 1000000).toFixed(2)}M
                            </p>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-gray-300">
                              ${(creator.marketCap / 1000000).toFixed(2)}M
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCreator(creator);
                                setOrderType("buy");
                              }}
                              className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                            >
                              Trade
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            {selectedCreator && (
              <div className="mt-6 glass-effect rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold text-white">
                      {selectedCreator.name} ({selectedCreator.symbol})
                    </h3>
                    <span className="text-2xl font-bold text-white">
                      ${selectedCreator.price.toFixed(2)}
                    </span>
                    <div
                      className={`flex items-center space-x-1 ${
                        selectedCreator.change24h > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedCreator.change24h > 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                      <span>{Math.abs(selectedCreator.change24h)}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {["1H", "1D", "1W", "1M", "All"].map((period) => (
                      <button
                        key={period}
                        className="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorPrice"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#9CA3AF" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Order Book */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Order Book
              </h3>

              <div className="space-y-1 mb-4">
                <div className="grid grid-cols-3 text-xs text-gray-400 pb-2">
                  <span>Price</span>
                  <span className="text-center">Amount</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Asks */}
                {orderBookData.asks.reverse().map((ask, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 text-sm relative"
                  >
                    <div
                      className="absolute inset-0 bg-red-500/10"
                      style={{ width: `${(ask.total / 150000) * 100}%` }}
                    />
                    <span className="text-red-400 relative z-10">
                      ${ask.price.toFixed(2)}
                    </span>
                    <span className="text-gray-300 text-center relative z-10">
                      {ask.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-300 text-right relative z-10">
                      ${(ask.total / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}

                <div className="py-2 text-center">
                  <span className="text-xl font-bold text-white">$54.70</span>
                  <span className="text-xs text-green-400 ml-2">↑ 0.5%</span>
                </div>

                {/* Bids */}
                {orderBookData.bids.map((bid, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 text-sm relative"
                  >
                    <div
                      className="absolute inset-0 bg-green-500/10"
                      style={{ width: `${(bid.total / 150000) * 100}%` }}
                    />
                    <span className="text-green-400 relative z-10">
                      ${bid.price.toFixed(2)}
                    </span>
                    <span className="text-gray-300 text-center relative z-10">
                      {bid.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-300 text-right relative z-10">
                      ${(bid.total / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Form */}
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setOrderType("buy")}
                  className={`flex-1 py-2 rounded-lg transition ${
                    orderType === "buy"
                      ? "bg-green-500/20 text-green-400 border border-green-500"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderType("sell")}
                  className={`flex-1 py-2 rounded-lg transition ${
                    orderType === "sell"
                      ? "bg-red-500/20 text-red-400 border border-red-500"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      USD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      Shares
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-3 border-t border-white/10">
                  <span className="text-gray-400">Total</span>
                  <span className="text-xl font-bold text-white">
                    $
                    {amount && price
                      ? (parseFloat(amount) * parseFloat(price)).toFixed(2)
                      : "0.00"}
                  </span>
                </div>

                <GlowingButton
                  onClick={handleTrade}
                  className="w-full"
                  variant={orderType === "buy" ? "primary" : "secondary"}
                >
                  {orderType === "buy" ? "Buy" : "Sell"}{" "}
                  {selectedCreator?.symbol || "Shares"}
                </GlowingButton>
              </div>
            </div>

            {/* Holdings */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Holdings
              </h3>
              <div className="space-y-3">
                {creators.slice(0, 3).map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {creator.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{creator.symbol}</p>
                        <p className="text-xs text-gray-400">
                          {Math.floor(Math.random() * 100)} shares
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">
                        $
                        {(
                          Math.floor(Math.random() * 100) * creator.price
                        ).toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${creator.change24h > 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {creator.change24h > 0 ? "+" : ""}
                        {creator.change24h}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
