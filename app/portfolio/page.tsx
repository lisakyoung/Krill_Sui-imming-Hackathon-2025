"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  Briefcase,
  Star,
  Clock,
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const portfolioData = [
  { name: "Creator Stocks", value: 45, color: "#8B5CF6" },
  { name: "Evolution NFTs", value: 25, color: "#EC4899" },
  { name: "Time Vaults", value: 20, color: "#10B981" },
  { name: "Liquid", value: 10, color: "#F59E0B" },
];

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Your Portfolio</h1>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-green-400">+12.5%</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">$45,678</p>
            <p className="text-sm text-gray-400">Total Portfolio Value</p>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-400">+$5,432</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">$12,345</p>
            <p className="text-sm text-gray-400">Today's Profit</p>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-gray-400">23 assets</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">89%</p>
            <p className="text-sm text-gray-400">Portfolio Health</p>
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Asset Distribution
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-2">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm text-white font-medium">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Top Holdings
            </h2>

            <div className="space-y-4">
              {[
                {
                  name: "ALEX",
                  type: "Stock",
                  amount: 234,
                  value: 12789,
                  change: 12.5,
                },
                {
                  name: "Evolution #42",
                  type: "NFT",
                  amount: 1,
                  value: 5600,
                  change: -3.2,
                },
                {
                  name: "LUNA",
                  type: "Stock",
                  amount: 456,
                  value: 14653,
                  change: 8.7,
                },
                {
                  name: "Time Vault #7",
                  type: "Vault",
                  amount: 1,
                  value: 10000,
                  change: 0,
                },
              ].map((holding, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {holding.name.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{holding.name}</p>
                      <p className="text-xs text-gray-400">
                        {holding.amount} {holding.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      ${holding.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${holding.change > 0 ? "text-green-400" : holding.change < 0 ? "text-red-400" : "text-gray-400"}`}
                    >
                      {holding.change > 0 && "+"}
                      {holding.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
