"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Clock,
  Gift,
  Users,
  TrendingUp,
  Plus,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function VaultsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vaultTitle, setVaultTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockCondition, setUnlockCondition] = useState<
    "time" | "milestone" | "community"
  >("time");
  const [unlockDate, setUnlockDate] = useState("");
  const [lockAmount, setLockAmount] = useState("");
  const [vaults, setVaults] = useState([
    {
      id: 1,
      title: "Birthday Message",
      creator: "Art Vision",
      timeLeft: "2 hours",
      value: 100,
    },
    {
      id: 2,
      title: "Project Launch",
      creator: "Code Ninja",
      timeLeft: "1 day",
      value: 500,
    },
    {
      id: 3,
      title: "Holiday Special",
      creator: "Music Maker",
      timeLeft: "3 days",
      value: 250,
    },
  ]);

  const handleCreateVault = () => {
    if (!vaultTitle || !lockAmount || !unlockDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const newVault = {
      id: vaults.length + 1,
      title: vaultTitle,
      creator: "You",
      timeLeft: "Just created",
      value: parseFloat(lockAmount),
    };

    setVaults([newVault, ...vaults]);

    // Update active vaults count
    const currentVaults = parseInt(localStorage.getItem("activeVaults") || "8");
    localStorage.setItem("activeVaults", (currentVaults + 1).toString());

    toast.success("Time Vault created successfully!");
    setShowCreateModal(false);

    // Reset form
    setVaultTitle("");
    setDescription("");
    setLockAmount("");
    setUnlockDate("");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Time Vaults</h1>
            <p className="text-gray-400">
              Lock content and value for future moments
            </p>
          </div>

          <GlowingButton onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Vault
          </GlowingButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Lock className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-green-400">+45</span>
            </div>
            <p className="text-2xl font-bold text-white">{vaults.length}</p>
            <p className="text-sm text-gray-400">Active Vaults</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-yellow-400">Live</span>
            </div>
            <p className="text-2xl font-bold text-white">23</p>
            <p className="text-sm text-gray-400">Unlocking Today</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">+12%</span>
            </div>
            <p className="text-2xl font-bold text-white">$2.4M</p>
            <p className="text-sm text-gray-400">Total Locked</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-purple-400">+2.3K</span>
            </div>
            <p className="text-2xl font-bold text-white">45.6K</p>
            <p className="text-sm text-gray-400">Recipients</p>
          </div>
        </div>

        {/* Upcoming Unlocks */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Upcoming Unlocks
          </h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/30" />

            <div className="space-y-8">
              {vaults.map((vault, index) => (
                <motion.div
                  key={vault.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-6"
                >
                  <div className="w-4 h-4 bg-purple-500 rounded-full relative z-10" />

                  <div className="flex-1 glass-effect rounded-xl p-4 hover:bg-white/5 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {vault.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          by {vault.creator}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {vault.timeLeft}
                        </p>
                        <p className="text-sm text-green-400">${vault.value}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Vault Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Create Time Vault
                    </h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Vault Title
                      </label>
                      <input
                        type="text"
                        value={vaultTitle}
                        onChange={(e) => setVaultTitle(e.target.value)}
                        placeholder="Enter vault title..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's inside this vault?"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Unlock Condition
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["time", "milestone", "community"] as const).map(
                          (condition) => (
                            <button
                              key={condition}
                              onClick={() => setUnlockCondition(condition)}
                              className={`px-3 py-2 rounded-lg capitalize transition ${
                                unlockCondition === condition
                                  ? "bg-purple-500 text-white"
                                  : "bg-white/5 text-gray-400 hover:bg-white/10"
                              }`}
                            >
                              {condition}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Unlock Date
                      </label>
                      <input
                        type="datetime-local"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Lock Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={lockAmount}
                        onChange={(e) => setLockAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <GlowingButton
                      onClick={handleCreateVault}
                      className="flex-1"
                    >
                      Create Vault
                    </GlowingButton>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
