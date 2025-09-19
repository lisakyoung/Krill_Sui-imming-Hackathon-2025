"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Sparkles,
  GitBranch,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Settings,
  TrendingUp,
  Users,
  Plus,
  Lock,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  ChevronRight,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function CreatorStudioEvolution() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [evolutionBranches, setEvolutionBranches] = useState([
    { id: 1, name: "Community Remix", views: 12500, engagement: 89 },
    { id: 2, name: "Extended Version", views: 8900, engagement: 76 },
    { id: 3, name: "Alternative Ending", views: 6700, engagement: 92 },
  ]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("creatorProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleCreateBranch = () => {
    const newBranch = {
      id: evolutionBranches.length + 1,
      name: `New Branch #${evolutionBranches.length + 1}`,
      views: 0,
      engagement: 0,
    };
    setEvolutionBranches([...evolutionBranches, newBranch]);
    toast.success("New evolution branch created!");
  };

  const handleEditContent = () => {
    toast.info("Opening content editor...");
    router.push("/content-editor");
  };

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/creator-dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {profile.contentTitle}
              </h1>
              <p className="text-gray-400">Evolution-enabled content</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleEditContent}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <GlowingButton onClick={() => router.push("/analytics")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </GlowingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                {profile.uploadedContent?.type?.startsWith("image") && (
                  <img
                    src={profile.uploadedContent.url}
                    alt={profile.contentTitle}
                    className="w-full h-full object-cover"
                  />
                )}
                {profile.uploadedContent?.type?.startsWith("video") && (
                  <video
                    src={profile.uploadedContent.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                {profile.uploadedContent?.type?.startsWith("audio") && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Volume2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <audio src={profile.uploadedContent.url} controls />
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 rounded-full text-xs text-white flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Evolution Enabled</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Eye className="w-5 h-5" />
                      <span>45.2k</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Heart className="w-5 h-5" />
                      <span>3.8k</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <MessageCircle className="w-5 h-5" />
                      <span>892</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <p className="text-gray-300">{profile.bio}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.categories?.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evolution Tree */}
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  <span>Evolution Branches</span>
                </h2>
                <button
                  onClick={handleCreateBranch}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Branch</span>
                </button>
              </div>

              <div className="space-y-3">
                {evolutionBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{branch.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{branch.views.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{branch.engagement}%</span>
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-300">
                  💡 Evolution branches allow your content to grow and adapt
                  based on community interaction. Content is encrypted with Seal
                  and stored on Walrus.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Controls - rest of the component remains the same */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Views</span>
                  <span className="text-white font-medium">45.2k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement Rate</span>
                  <span className="text-green-400 font-medium">8.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Evolution Level</span>
                  <span className="text-purple-400 font-medium">Lv.12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Share Value</span>
                  <span className="text-white font-medium">
                    ${profile.sharePrice * 1.5}
                  </span>
                </div>
              </div>
            </div>

            {/* Management Options */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Content Management
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => toast.info("Opening monetization settings...")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Monetization</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => toast.info("Opening access control...")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Access Control</span>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => toast.info("Opening community settings...")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Community</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => toast.info("Opening evolution settings...")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Evolution Rules</span>
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Walrus & Seal Info */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Storage & Encryption
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Walrus CID</p>
                  <p className="text-purple-400 font-mono text-xs mt-1">
                    {profile.uploadedContent?.walrusCID}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Seal Encryption</p>
                  <p className="text-green-400 mt-1">Active ✓</p>
                </div>
                <div>
                  <p className="text-gray-400">Storage Used</p>
                  <p className="text-white mt-1">
                    {(
                      (profile.uploadedContent?.size || 0) /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
