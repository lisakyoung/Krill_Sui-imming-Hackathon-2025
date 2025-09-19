"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Clock,
  Gavel,
  DollarSign,
  Users,
  GitBranch,
  Lock,
  Eye,
  Filter,
  Calendar,
} from "lucide-react";

export default function ActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem("userActivities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // Default activities
      setActivities([
        {
          id: 1,
          type: "evolution",
          text: "Content evolved to Lv.24",
          time: new Date().toISOString(),
          icon: Sparkles,
        },
        {
          id: 2,
          type: "auction",
          text: "Won auction from Alex Rivers",
          time: new Date().toISOString(),
          icon: Gavel,
        },
        {
          id: 3,
          type: "vault",
          text: "Time vault unlocked",
          time: new Date().toISOString(),
          icon: Clock,
        },
        {
          id: 4,
          type: "investment",
          text: "Bought 100 LUNA shares",
          time: new Date().toISOString(),
          icon: TrendingUp,
        },
      ]);
    }

    // Listen for activity updates
    const handleActivityUpdate = () => {
      const updated = localStorage.getItem("userActivities");
      if (updated) {
        setActivities(JSON.parse(updated));
      }
    };

    window.addEventListener("storage", handleActivityUpdate);
    return () => window.removeEventListener("storage", handleActivityUpdate);
  }, []);

  // Track user actions globally
  useEffect(() => {
    const trackActivity = (type: string, text: string) => {
      const newActivity = {
        id: Date.now(),
        type,
        text,
        time: new Date().toISOString(),
        icon: getIconForType(type),
      };

      const existingActivities = JSON.parse(
        localStorage.getItem("userActivities") || "[]"
      );
      const updated = [newActivity, ...existingActivities].slice(0, 50); // Keep last 50 activities
      localStorage.setItem("userActivities", JSON.stringify(updated));
      setActivities(updated);
    };

    // Make trackActivity available globally
    (window as any).trackActivity = trackActivity;
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case "evolution":
        return Sparkles;
      case "auction":
        return Gavel;
      case "vault":
        return Lock;
      case "investment":
        return TrendingUp;
      case "subscription":
        return Users;
      case "branch":
        return GitBranch;
      default:
        return Eye;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Activity Feed</h1>
              <p className="text-gray-400">Your complete activity history</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {[
              "all",
              "evolution",
              "auction",
              "investment",
              "vault",
              "subscription",
            ].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition ${
                  filter === type
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-effect rounded-xl p-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{activity.text}</p>
                      <p className="text-xs text-gray-400">
                        {getTimeAgo(activity.time)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No activities yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start exploring to see your activities here
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
