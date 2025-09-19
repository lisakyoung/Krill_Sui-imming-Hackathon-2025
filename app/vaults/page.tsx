"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layouts/MainLayout";
import { GlowingButton } from "@/components/ui/GlowingButton";
import {
  Lock,
  Unlock,
  Clock,
  Calendar,
  Gift,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  Plus,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function VaultsPage() {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [vaultForm, setVaultForm] = useState({
    title: "",
    description: "",
    unlockDate: "",
    unlockCondition: "time",
    recipients: "",
    lockedAmount: "",
  });

  const vaults = [
    {
      id: 1,
      title: "Anniversary Surprise",
      creator: "Alex Rivers",
      type: "personal",
      unlockDate: "2025-07-15",
      daysRemaining: 234,
      lockedValue: 5000,
      recipients: 1,
      status: "locked",
      image: "/api/placeholder/400/200",
      description:
        "A special message for my biggest fan's one-year anniversary",
    },
    {
      id: 2,
      title: "10K Subscribers Celebration",
      creator: "Luna Park",
      type: "community",
      unlockCondition: "10,000 subscribers",
      currentProgress: 8923,
      targetProgress: 10000,
      lockedValue: 10000,
      recipients: "All subscribers",
      status: "locked",
      image: "/api/placeholder/400/200",
      description: "Exclusive content drop when we hit 10K family members!",
    },
    {
      id: 3,
      title: "Time Capsule 2034",
      creator: "Dev Master",
      type: "generational",
      unlockDate: "2034-01-01",
      daysRemaining: 3287,
      lockedValue: 50000,
      recipients: "Future generation",
      status: "locked",
      image: "/api/placeholder/400/200",
      description: "A message to the Web3 developers of 2034",
    },
  ];

  const upcomingUnlocks = [
    {
      time: "2 hours",
      title: "Birthday Message",
      creator: "Art Vision",
      value: 100,
    },
    {
      time: "1 day",
      title: "Project Launch",
      creator: "Code Ninja",
      value: 500,
    },
    {
      time: "3 days",
      title: "Holiday Special",
      creator: "Music Maker",
      value: 250,
    },
  ];

  const handleCreateVault = async () => {
    setIsCreating(true);

    // Simulate vault creation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Time Vault created successfully!");
    setIsCreating(false);
    setVaultForm({
      title: "",
      description: "",
      unlockDate: "",
      unlockCondition: "time",
      recipients: "",
      lockedAmount: "",
    });
  };

  const calculateTimeRemaining = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diff = unlock.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 365) {
      return `${Math.floor(days / 365)} years`;
    } else if (days > 30) {
      return `${Math.floor(days / 30)} months`;
    } else if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return "Soon";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Time Vaults</h1>
            <p className="text-gray-400 text-lg">
              Lock content and value for future moments
            </p>
          </div>

          <GlowingButton
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Vault</span>
          </GlowingButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Lock,
              label: "Active Vaults",
              value: "1,234",
              change: "+45",
            },
            {
              icon: Clock,
              label: "Unlocking Today",
              value: "23",
              change: "Live",
            },
            {
              icon: TrendingUp,
              label: "Total Locked",
              value: "$2.4M",
              change: "+12%",
            },
            {
              icon: Users,
              label: "Recipients",
              value: "45.6K",
              change: "+2.3K",
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

        {/* Upcoming Unlocks Timeline */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Upcoming Unlocks
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/30" />
            {upcomingUnlocks.map((unlock, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center mb-6 last:mb-0"
              >
                <div className="absolute left-8 w-3 h-3 bg-purple-500 rounded-full -translate-x-1/2">
                  <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping" />
                </div>
                <div className="ml-16 flex-1 flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer">
                  <div>
                    <p className="text-white font-medium">{unlock.title}</p>
                    <p className="text-sm text-gray-400">by {unlock.creator}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-medium">{unlock.time}</p>
                    <p className="text-sm text-gray-400">${unlock.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vaults Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vaults.map((vault, index) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setSelectedVault(vault)}
            >
              {/* Vault Image */}
              <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-16 h-16 text-white/20" />
                </div>
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs text-white ${
                      vault.type === "personal"
                        ? "bg-blue-500"
                        : vault.type === "community"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                    }`}
                  >
                    {vault.type}
                  </div>
                </div>
              </div>

              {/* Vault Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {vault.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {vault.description}
                </p>

                {/* Progress or Timer */}
                {vault.unlockCondition ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-purple-400">
                        {vault.currentProgress?.toLocaleString()} /{" "}
                        {vault.targetProgress?.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(vault.currentProgress! / vault.targetProgress!) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Unlocks in {calculateTimeRemaining(vault.unlockDate!)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Locked Value</p>
                    <p className="text-lg font-bold text-white">
                      ${vault.lockedValue.toLocaleString()}
                    </p>
                  </div>
                  <button className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition">
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Vault Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsCreating(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-purple-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Create Time Vault
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Vault Title
                    </label>
                    <input
                      type="text"
                      value={vaultForm.title}
                      onChange={(e) =>
                        setVaultForm({ ...vaultForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="Enter vault title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={vaultForm.description}
                      onChange={(e) =>
                        setVaultForm({
                          ...vaultForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
                      placeholder="What's inside this vault?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Unlock Condition
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["time", "milestone", "community"].map((condition) => (
                        <button
                          key={condition}
                          onClick={() =>
                            setVaultForm({
                              ...vaultForm,
                              unlockCondition: condition,
                            })
                          }
                          className={`p-3 rounded-lg border transition ${
                            vaultForm.unlockCondition === condition
                              ? "bg-purple-500/20 border-purple-500 text-white"
                              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          {condition.charAt(0).toUpperCase() +
                            condition.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {vaultForm.unlockCondition === "time" && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Unlock Date
                      </label>
                      <input
                        type="datetime-local"
                        value={vaultForm.unlockDate}
                        onChange={(e) =>
                          setVaultForm({
                            ...vaultForm,
                            unlockDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Lock Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={vaultForm.lockedAmount}
                      onChange={(e) =>
                        setVaultForm({
                          ...vaultForm,
                          lockedAmount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <GlowingButton onClick={handleCreateVault} className="flex-1">
                    Create Vault
                  </GlowingButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
