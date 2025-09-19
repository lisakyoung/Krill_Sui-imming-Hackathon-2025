"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  Gavel,
  Star,
  Share2,
  Bell,
  DollarSign,
  Eye,
  Heart,
  Play,
  Maximize2,
  Volume2,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function CreatorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const creatorId = params.id as string;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [uploadedContent, setUploadedContent] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("creatorProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.uploadedContent) {
        setUploadedContent(profile.uploadedContent);
      }
    }
  }, []);

  const creators: { [key: string]: any } = {
    "1": {
      name: "Alex Rivers",
      bio: "Digital artist pushing boundaries of creativity",
      avatar: "A",
      sharePrice: 45.2,
      change: 12.5,
      subscribers: 12500,
      evolutionLevel: 23,
      vaults: 5,
      category: "Music",
    },
    "2": {
      name: "Luna Park",
      bio: "Creating immersive experiences through art",
      avatar: "L",
      sharePrice: 32.15,
      change: 5.2,
      subscribers: 8900,
      evolutionLevel: 18,
      vaults: 3,
      category: "Art",
    },
  };

  const creator = creators[creatorId] || creators["1"];

  const contents = [
    ...(uploadedContent && creatorId === "1"
      ? [
          {
            id: "uploaded",
            title: uploadedContent.title || "My Latest Creation",
            views: 2100,
            likes: 180,
            evolution: 1,
            type: uploadedContent.type,
            url: uploadedContent.url,
            isNew: true,
          },
        ]
      : []),
    {
      id: 1,
      title: "Genesis Collection",
      views: 45600,
      likes: 3800,
      evolution: 12,
      type: "video",
    },
    {
      id: 2,
      title: "Time Vault Special",
      views: 38900,
      likes: 2900,
      evolution: 9,
      type: "image",
    },
    {
      id: 3,
      title: "Community Choice",
      views: 31200,
      likes: 2100,
      evolution: 15,
      type: "audio",
    },
  ];

  const handleInvest = () => {
    router.push(`/invest/${creatorId}`);
  };

  const handleJoinAuction = () => {
    router.push(`/auction/${creatorId}`);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    const currentSubs = parseInt(
      localStorage.getItem("totalSubscribers") || "1234"
    );
    localStorage.setItem(
      "totalSubscribers",
      (currentSubs + (isSubscribed ? -1 : 1)).toString()
    );
    toast.success(isSubscribed ? "Unsubscribed" : "Subscribed successfully!");
  };

  const handleContentClick = (content: any) => {
    localStorage.setItem("selectedContent", JSON.stringify(content));
    router.push(`/content-view/${content.id}`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="glass-effect rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {creator.avatar}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {creator.name}
                </h1>
                <p className="text-gray-400 mb-4">{creator.bio}</p>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    {creator.category}
                  </span>
                  <span className="text-sm text-gray-400">
                    Level {creator.evolutionLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleSubscribe}
                className={`px-4 py-2 rounded-lg transition ${
                  isSubscribed
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-5 h-5 inline mr-2" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span
                className={`text-xs ${creator.change > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {creator.change > 0 ? "+" : ""}
                {creator.change}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${creator.sharePrice}
            </p>
            <p className="text-sm text-gray-400">Share Price</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {creator.subscribers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Subscribers</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              Lv.{creator.evolutionLevel}
            </p>
            <p className="text-sm text-gray-400">Evolution</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Clock className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">{creator.vaults}</p>
            <p className="text-sm text-gray-400">Time Vaults</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <GlowingButton onClick={handleInvest} className="w-full">
            <DollarSign className="w-5 h-5 mr-2" />
            Invest in {creator.name}
          </GlowingButton>
          <button
            onClick={handleJoinAuction}
            className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center justify-center space-x-2"
          >
            <Gavel className="w-5 h-5" />
            <span>Join Auction</span>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Popular Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contents.map((content) => (
              <motion.div
                key={content.id}
                onClick={() => handleContentClick(content)}
                className="glass-effect rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition"
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative flex items-center justify-center">
                  {content.isNew && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 rounded text-xs text-white">
                      Your Upload
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 rounded text-xs text-white">
                    Lv.{content.evolution}
                  </div>

                  {content.type?.startsWith("video") && (
                    <Play className="w-12 h-12 text-white/60" />
                  )}
                  {content.type?.startsWith("image") && content.url && (
                    <img
                      src={content.url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {content.type?.startsWith("audio") && (
                    <Volume2 className="w-12 h-12 text-white/60" />
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {content.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{(content.views / 1000).toFixed(1)}k</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{(content.likes / 1000).toFixed(1)}k</span>
                      </span>
                    </div>
                    <span className="text-purple-400">View →</span>
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
