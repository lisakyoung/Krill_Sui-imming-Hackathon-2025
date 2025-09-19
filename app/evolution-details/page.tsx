"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitBranch,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Plus,
  ChevronRight,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function EvolutionDetailsPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const evolutionData = {
    currentLevel: 23,
    totalBranches: 47,
    activeContributors: 892,
    totalEvolutions: 156,
    growthRate: 12.5,
  };

  const branches = [
    {
      id: 1,
      name: "Community Remix v2.3",
      creator: "MusicMaker",
      level: 8,
      views: 45200,
      engagement: 89,
      contributors: 234,
      status: "active",
    },
    {
      id: 2,
      name: "Extended Universe",
      creator: "ArtVision",
      level: 6,
      views: 38900,
      engagement: 76,
      contributors: 189,
      status: "active",
    },
    {
      id: 3,
      name: "Alternative Timeline",
      creator: "CodeNinja",
      level: 5,
      views: 27600,
      engagement: 92,
      contributors: 156,
      status: "pending",
    },
  ];

  const handleViewBranch = (branchId: number) => {
    router.push(`/evolution-branch/${branchId}`);
  };

  const handleCreateBranch = () => {
    router.push("/create-branch");
  };

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
                Evolution Details
              </h1>
              <p className="text-gray-400">
                Track and manage content evolution
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleCreateBranch}>
            <Plus className="w-4 h-4 mr-2" />
            Create Branch
          </GlowingButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              Lv.{evolutionData.currentLevel}
            </p>
            <p className="text-sm text-gray-400">Current Level</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <GitBranch className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {evolutionData.totalBranches}
            </p>
            <p className="text-sm text-gray-400">Total Branches</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Users className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {evolutionData.activeContributors}
            </p>
            <p className="text-sm text-gray-400">Contributors</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {evolutionData.totalEvolutions}
            </p>
            <p className="text-sm text-gray-400">Evolutions</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Clock className="w-5 h-5 text-pink-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              +{evolutionData.growthRate}%
            </p>
            <p className="text-sm text-gray-400">Growth Rate</p>
          </div>
        </div>

        {/* Evolution Tree Visualization */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Evolution Tree
          </h2>
          <div className="relative h-96 bg-gradient-to-b from-purple-500/5 to-transparent rounded-xl p-6">
            {/* Simplified tree visualization */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">Root</span>
            </div>

            <div className="absolute top-32 left-1/4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">B1</span>
            </div>

            <div className="absolute top-32 right-1/4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">B2</span>
            </div>

            <div className="absolute bottom-20 left-1/3 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">L1</span>
            </div>

            <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">L2</span>
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="50%"
                y1="90"
                x2="25%"
                y2="150"
                stroke="white"
                strokeOpacity="0.2"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="90"
                x2="75%"
                y2="150"
                stroke="white"
                strokeOpacity="0.2"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Active Branches */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Active Branches
          </h2>
          <div className="space-y-4">
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                onClick={() => handleViewBranch(branch.id)}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {branch.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          branch.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {branch.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Created by {branch.creator}
                    </p>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-white">Lv.{branch.level}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-white">
                          {(branch.views / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{branch.engagement}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-white">
                          {branch.contributors}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
