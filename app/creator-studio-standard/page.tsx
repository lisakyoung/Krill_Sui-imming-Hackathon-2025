"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Settings,
  TrendingUp,
  Users,
  Lock,
  ArrowLeft,
  Volume2,
  DollarSign,
  BarChart3,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function CreatorStudioStandard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("creatorProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleEditContent = () => {
    router.push("/content-editor");
  };

  const handleAnalytics = () => {
    router.push("/analytics");
  };

  const handleManageOption = (option: string) => {
    switch (option) {
      case "monetization":
        router.push("/monetization-settings");
        break;
      case "access":
        router.push("/access-control");
        break;
      case "community":
        router.push("/community-settings");
        break;
      case "schedule":
        router.push("/schedule-settings");
        break;
    }
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
                {profile.contentTitle || "Untitled Content"}
              </h1>
              <p className="text-gray-400">Standard content management</p>
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
            <GlowingButton onClick={handleAnalytics}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </GlowingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                {profile.uploadedContent?.type?.startsWith("image") && (
                  <img
                    src={profile.uploadedContent.url}
                    alt={profile.contentTitle}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                )}
                {profile.uploadedContent?.type?.startsWith("video") && (
                  <video
                    src={profile.uploadedContent.url}
                    className="w-full h-auto max-h-[500px]"
                    controls
                    autoPlay={false}
                    muted
                  />
                )}
                {profile.uploadedContent?.type?.startsWith("audio") && (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Volume2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <audio
                        src={profile.uploadedContent.url}
                        controls
                        className="w-64"
                      />
                    </div>
                  </div>
                )}
                {!profile.uploadedContent && (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">No content uploaded yet</p>
                  </div>
                )}

                <div className="absolute top-4 right-4 px-3 py-1 bg-gray-500 rounded-full text-xs text-white">
                  Standard Content
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Eye className="w-5 h-5" />
                      <span>32.1k</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Heart className="w-5 h-5" />
                      <span>2.4k</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <MessageCircle className="w-5 h-5" />
                      <span>456</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <p className="text-gray-300">
                  {profile.bio || "No description provided"}
                </p>

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

            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Content Performance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <BarChart3 className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">32.1k</p>
                  <p className="text-sm text-gray-400">Total Views</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <Heart className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-2xl font-bold text-white">7.5%</p>
                  <p className="text-sm text-gray-400">Engagement Rate</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <Users className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-2xl font-bold text-white">1.2k</p>
                  <p className="text-sm text-gray-400">New Subscribers</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <DollarSign className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold text-white">$234</p>
                  <p className="text-sm text-gray-400">Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Views</span>
                  <span className="text-white font-medium">32.1k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement Rate</span>
                  <span className="text-green-400 font-medium">7.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subscribers</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Share Value</span>
                  <span className="text-white font-medium">
                    ${profile.sharePrice || 10}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Content Management
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleManageOption("monetization")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Monetization</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => handleManageOption("access")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Access Control</span>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => handleManageOption("community")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Community</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <button
                  onClick={() => handleManageOption("schedule")}
                  className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">Schedule</span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
