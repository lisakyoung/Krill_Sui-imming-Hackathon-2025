"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  Calendar,
  Download,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PortfolioDetailsPage() {
  const router = useRouter();
  const [portfolioValue, setPortfolioValue] = useState(12456);
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolioValue");
    const savedInvestments = localStorage.getItem("userInvestments");

    if (savedPortfolio) setPortfolioValue(parseFloat(savedPortfolio));
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
  }, []);

  const portfolioData = [
    { month: "Jan", value: 8000 },
    { month: "Feb", value: 9200 },
    { month: "Mar", value: 10500 },
    { month: "Apr", value: 11200 },
    { month: "May", value: 11800 },
    { month: "Jun", value: portfolioValue },
  ];

  const distribution = [
    { name: "Alex Rivers", value: 45, color: "#8B5CF6" },
    { name: "Luna Park", value: 30, color: "#EC4899" },
    { name: "Others", value: 25, color: "#10B981" },
  ];

  const holdings = [
    { creator: "Alex Rivers", shares: 250, value: 11250, change: 12.5 },
    { creator: "Luna Park", shares: 180, value: 5787, change: 5.2 },
    { creator: "Code Ninja", shares: 100, value: 2340, change: -3.1 },
    { creator: "Art Vision", shares: 75, value: 1879, change: 8.7 },
  ];

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
                Portfolio Details
              </h1>
              <p className="text-gray-400">
                Complete overview of your investments
              </p>
            </div>
          </div>

          <GlowingButton onClick={() => router.push("/invest/1")}>
            <DollarSign className="w-4 h-4 mr-2" />
            New Investment
          </GlowingButton>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">+12.5%</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${portfolioValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Value</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <Activity className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-sm text-gray-400">Active Positions</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">$1,847</p>
            <p className="text-sm text-gray-400">Today's Gain</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <PieChart className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">68%</p>
            <p className="text-sm text-gray-400">Win Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Chart */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Portfolio Performance
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
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
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Distribution
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {distribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="glass-effect rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Holdings</h2>
            <button className="text-purple-400 hover:text-purple-300 transition">
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-3 text-sm text-gray-400">Creator</th>
                  <th className="pb-3 text-sm text-gray-400">Shares</th>
                  <th className="pb-3 text-sm text-gray-400">Value</th>
                  <th className="pb-3 text-sm text-gray-400">24h Change</th>
                  <th className="pb-3 text-sm text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 text-white">{holding.creator}</td>
                    <td className="py-4 text-white">{holding.shares}</td>
                    <td className="py-4 text-white">
                      ${holding.value.toLocaleString()}
                    </td>
                    <td
                      className={`py-4 ${holding.change > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {holding.change > 0 ? "+" : ""}
                      {holding.change}%
                    </td>
                    <td className="py-4">
                      <button className="text-purple-400 hover:text-purple-300 transition">
                        Trade →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-effect rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-3">
            {investments.slice(0, 5).map((inv, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white">
                      Bought {inv.shares} shares of {inv.creatorName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(inv.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-white font-semibold">
                  ${inv.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
