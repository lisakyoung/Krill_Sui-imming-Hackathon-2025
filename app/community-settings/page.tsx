"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Bell,
  Shield,
  Mail,
  Award,
  Settings,
  Save,
  Plus,
  X,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function CommunitySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    allowComments: true,
    allowRemixes: true,
    moderationLevel: "medium",
    autoReply: false,
    welcomeMessage: "",
    communityGuidelines: "",
    bannedWords: [] as string[],
    moderators: [] as string[],
  });

  const [newBannedWord, setNewBannedWord] = useState("");
  const [newModerator, setNewModerator] = useState("");

  const handleSave = () => {
    localStorage.setItem("communitySettings", JSON.stringify(settings));
    toast.success("Community settings saved!");

    // Track activity
    const trackActivity = (window as any).trackActivity;
    if (trackActivity) {
      trackActivity("settings", "Updated community settings");
    }
  };

  const addBannedWord = () => {
    if (newBannedWord && !settings.bannedWords.includes(newBannedWord)) {
      setSettings({
        ...settings,
        bannedWords: [...settings.bannedWords, newBannedWord],
      });
      setNewBannedWord("");
    }
  };

  const addModerator = () => {
    if (newModerator && !settings.moderators.includes(newModerator)) {
      setSettings({
        ...settings,
        moderators: [...settings.moderators, newModerator],
      });
      setNewModerator("");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Community Settings
              </h1>
              <p className="text-gray-400">
                Manage your community interactions
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </GlowingButton>
        </div>

        {/* Engagement Settings */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Engagement Settings
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Allow Comments</p>
                <p className="text-sm text-gray-400">
                  Let viewers comment on your content
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowComments}
                onChange={(e) =>
                  setSettings({ ...settings, allowComments: e.target.checked })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Allow Remixes</p>
                <p className="text-sm text-gray-400">
                  Enable evolution branches from community
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRemixes}
                onChange={(e) =>
                  setSettings({ ...settings, allowRemixes: e.target.checked })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Auto-Reply</p>
                <p className="text-sm text-gray-400">
                  Send automatic welcome messages
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoReply}
                onChange={(e) =>
                  setSettings({ ...settings, autoReply: e.target.checked })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Moderation */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Moderation</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Moderation Level
            </label>
            <select
              value={settings.moderationLevel}
              onChange={(e) =>
                setSettings({ ...settings, moderationLevel: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="low">Low - Minimal filtering</option>
              <option value="medium">Medium - Balanced approach</option>
              <option value="high">High - Strict filtering</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Banned Words
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newBannedWord}
                onChange={(e) => setNewBannedWord(e.target.value)}
                placeholder="Add banned word..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addBannedWord}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.bannedWords.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{word}</span>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        bannedWords: settings.bannedWords.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Moderators
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newModerator}
                onChange={(e) => setNewModerator(e.target.value)}
                placeholder="Add moderator address..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addModerator}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="space-y-2">
              {settings.moderators.map((mod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white font-mono text-sm">{mod}</span>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        moderators: settings.moderators.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Community Messages
          </h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Welcome Message
            </label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) =>
                setSettings({ ...settings, welcomeMessage: e.target.value })
              }
              placeholder="Welcome new community members..."
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Community Guidelines
            </label>
            <textarea
              value={settings.communityGuidelines}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  communityGuidelines: e.target.value,
                })
              }
              placeholder="Set your community rules..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/community-analytics")}
            className="p-4 glass-effect rounded-xl hover:bg-white/10 transition"
          >
            <MessageCircle className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-white">View Analytics</p>
            <p className="text-xs text-gray-400">Community insights</p>
          </button>

          <button
            onClick={() => router.push("/community-rewards")}
            className="p-4 glass-effect rounded-xl hover:bg-white/10 transition"
          >
            <Award className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-white">Rewards Program</p>
            <p className="text-xs text-gray-400">Set up rewards</p>
          </button>

          <button
            onClick={() => toast.info("Opening broadcast composer...")}
            className="p-4 glass-effect rounded-xl hover:bg-white/10 transition"
          >
            <Mail className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-white">Broadcast</p>
            <p className="text-xs text-gray-400">Message all members</p>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
