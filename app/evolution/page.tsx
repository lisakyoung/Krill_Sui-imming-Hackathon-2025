"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layouts/MainLayout";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  Sparkles,
  GitBranch,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Zap,
  Info,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EvolutionPage() {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [evolutionTrigger, setEvolutionTrigger] = useState("");
  const [isEvolving, setIsEvolving] = useState(false);

  const contents = [
    {
      id: 1,
      title: "The Genesis Story",
      creator: "Alex Rivers",
      level: 12,
      branches: 7,
      views: 125000,
      engagement: 8900,
      nextEvolution: { views: 150000, engagement: 10000 },
    },
    {
      id: 2,
      title: "Digital Dreams EP",
      creator: "Luna Park",
      level: 8,
      branches: 4,
      views: 89000,
      engagement: 6200,
      nextEvolution: { views: 100000, engagement: 7000 },
    },
    {
      id: 3,
      title: "Code Chronicles",
      creator: "Dev Master",
      level: 15,
      branches: 12,
      views: 234000,
      engagement: 18900,
      nextEvolution: { views: 250000, engagement: 20000 },
    },
  ];

  const handleEvolve = async () => {
    if (!selectedContent || !evolutionTrigger) {
      toast.error("Please select content and evolution type");
      return;
    }

    setIsEvolving(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.success("🎉 Content evolved successfully!");
    setIsEvolving(false);
    setEvolutionTrigger("");
  };

  // Evolution tree visualization (simple version without Three.js)
  const evolutionNodes = [
    { id: 1, x: 50, y: 50, level: 0, label: "Origin" },
    { id: 2, x: 25, y: 150, level: 1, label: "Branch A" },
    { id: 3, x: 75, y: 150, level: 1, label: "Branch B" },
    { id: 4, x: 15, y: 250, level: 2, label: "Sub A1" },
    { id: 5, x: 35, y: 250, level: 2, label: "Sub A2" },
    { id: 6, x: 65, y: 250, level: 2, label: "Sub B1" },
    { id: 7, x: 85, y: 250, level: 2, label: "Sub B2" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Evolution Lab</h1>
          <p className="text-gray-400 text-lg">
            Watch your content grow and branch into new dimensions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: GitBranch,
              label: "Total Evolutions",
              value: "1,234",
              change: "+12%",
            },
            {
              icon: Sparkles,
              label: "Active Branches",
              value: "456",
              change: "+8%",
            },
            {
              icon: Users,
              label: "Contributors",
              value: "789",
              change: "+15%",
            },
            {
              icon: Trophy,
              label: "Rare Discoveries",
              value: "23",
              change: "+3%",
            },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Simple Evolution Tree Visualization */}
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Evolution Tree
              </h2>
              <button className="text-gray-400 hover:text-white transition">
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Simple SVG Tree */}
            <div className="h-[400px] bg-black/20 rounded-xl overflow-hidden relative">
              <svg className="w-full h-full">
                {/* Draw connections */}
                <line
                  x1="50%"
                  y1="50"
                  x2="25%"
                  y2="150"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
                <line
                  x1="50%"
                  y1="50"
                  x2="75%"
                  y2="150"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
                <line
                  x1="25%"
                  y1="150"
                  x2="15%"
                  y2="250"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
                <line
                  x1="25%"
                  y1="150"
                  x2="35%"
                  y2="250"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
                <line
                  x1="75%"
                  y1="150"
                  x2="65%"
                  y2="250"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
                <line
                  x1="75%"
                  y1="150"
                  x2="85%"
                  y2="250"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />

                {/* Draw nodes */}
                {evolutionNodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={`${node.x}%`}
                      cy={node.y}
                      r="20"
                      fill={
                        node.level === 0
                          ? "#8B5CF6"
                          : node.level === 1
                            ? "#EC4899"
                            : "#10B981"
                      }
                      className="cursor-pointer hover:opacity-80 transition"
                      onClick={() => toast(`Node clicked: ${node.label}`)}
                    />
                    <text
                      x={`${node.x}%`}
                      y={node.y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      className="pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300">
                💡 Click nodes to explore evolution branches. Each branch
                represents a unique content evolution.
              </p>
            </div>
          </div>

          {/* Evolution Control Panel */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Trigger Evolution
            </h2>

            {/* Content Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Select Content
              </label>
              <div className="grid grid-cols-1 gap-3">
                {contents.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedContent?.id === content.id
                        ? "bg-purple-500/20 border-purple-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-white font-medium">
                          {content.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          by {content.creator}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-purple-400">
                          Lv.{content.level}
                        </p>
                        <p className="text-xs text-gray-400">
                          {content.branches} branches
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Evolution Type */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Evolution Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "community", label: "Community Vote", icon: Users },
                  { id: "engagement", label: "High Engagement", icon: Heart },
                  { id: "time", label: "Time-based", icon: Clock },
                  { id: "special", label: "Special Event", icon: Zap },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setEvolutionTrigger(type.id)}
                      className={`p-3 rounded-lg border transition-all flex items-center space-x-2 ${
                        evolutionTrigger === type.id
                          ? "bg-purple-500/20 border-purple-500"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Indicator */}
            {selectedContent && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Evolution Progress</span>
                  <span className="text-purple-400">
                    {Math.round(
                      (selectedContent.views /
                        selectedContent.nextEvolution.views) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(selectedContent.views / selectedContent.nextEvolution.views) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Evolution Button */}
            <GlowingButton
              onClick={handleEvolve}
              disabled={!selectedContent || !evolutionTrigger || isEvolving}
              className="w-full"
            >
              {isEvolving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evolving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Trigger Evolution</span>
                </div>
              )}
            </GlowingButton>
          </div>
        </div>

        {/* Recent Evolutions */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Evolutions
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
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GitBranch className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 rounded text-xs text-white">
                    New Branch
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    The Genesis Story → Chapter {i + 1}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Discovered by @cryptoArtist • {i + 1} hours ago
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>12.5k</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>892</span>
                      </div>
                    </div>
                    <span className="text-xs text-purple-400">Level 13</span>
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
