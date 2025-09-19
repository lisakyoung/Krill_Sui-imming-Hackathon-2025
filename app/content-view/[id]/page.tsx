"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Sparkles,
  GitBranch,
  Lock,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function ContentViewPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;
  const [content, setContent] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem("selectedContent");
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites!");
  };

  const handleEvolution = () => {
    toast.info("Evolution feature coming soon!");
  };

  if (!content) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Loading content...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                {content.type?.startsWith("video") && content.url && (
                  <video
                    src={content.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
                {content.type?.startsWith("image") && content.url && (
                  <img
                    src={content.url}
                    alt={content.title}
                    className="w-full h-full object-contain"
                  />
                )}
                {content.type?.startsWith("audio") && content.url && (
                  <div className="flex items-center justify-center h-full">
                    <audio
                      src={content.url}
                      controls
                      autoPlay
                      className="w-3/4"
                    />
                  </div>
                )}

                {content.evolution && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 rounded-full text-xs text-white flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Level {content.evolution}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-4">
                  {content.title}
                </h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-1 transition ${
                        liked
                          ? "text-red-400"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                      />
                      <span>{content.likes || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <MessageCircle className="w-5 h-5" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{content.views?.toLocaleString() || 0} views</span>
                  </div>
                </div>

                <p className="text-gray-300">
                  Experience the latest creation from our talented creator. This
                  content is part of an evolving ecosystem where community
                  interaction drives the creative direction.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Evolution Options */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Evolution Options
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleEvolution}
                  className="w-full p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Trigger Evolution
                      </p>
                      <p className="text-xs text-gray-400">
                        Create a new branch
                      </p>
                    </div>
                    <GitBranch className="w-5 h-5 text-purple-400" />
                  </div>
                </button>

                <button className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Download</p>
                      <p className="text-xs text-gray-400">Save to device</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Create Vault</p>
                      <p className="text-xs text-gray-400">Lock for future</p>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            {/* Content Stats */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white">
                    {content.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-white">
                    {content.likes?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Evolution Level</span>
                  <span className="text-purple-400">
                    Level {content.evolution || 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">
                    {content.type?.split("/")[0] || "Media"}
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
