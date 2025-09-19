"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Clock,
  Gift,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  Unlock,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function VaultsDetailsPage() {
  const router = useRouter();
  const [activeVaults, setActiveVaults] = useState(8);

  useEffect(() => {
    const saved = localStorage.getItem("activeVaults");
    if (saved) setActiveVaults(parseInt(saved));
  }, []);

  const vaults = [
    {
      id: 1,
      title: "Anniversary Special",
      creator: "You",
      locked: 5000,
      unlockDate: "2025-12-25",
      recipients: 234,
      status: "active",
      progress: 75,
    },
    {
      id: 2,
      title: "Milestone Reward",
      creator: "Alex Rivers",
      locked: 2500,
      unlockDate: "2025-10-15",
      recipients: 156,
      status: "pending",
      progress: 45,
    },
    {
      id: 3,
      title: "Community Achievement",
      creator: "Luna Park",
      locked: 3200,
      unlockDate: "2025-11-01",
      recipients: 189,
      status: "active",
      progress: 60,
    },
  ];

  const handleUnlockVault = (vaultId: number) => {
    toast.success("Vault unlocked successfully!");
    router.push(`/vault/${vaultId}`);
  };

  const handleManageVault = (vaultId: number) => {
    router.push(`/vault-manage/${vaultId}`);
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
                Vaults Management
              </h1>
              <p className="text-gray-400">
                Control and monitor your Time Vaults
              </p>
            </div>
          </div>

          <GlowingButton onClick={() => router.push("/vaults")}>
            <Lock className="w-4 h-4 mr-2" />
            Create New Vault
          </GlowingButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <Lock className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{activeVaults}</p>
            <p className="text-sm text-gray-400">Active Vaults</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Clock className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-gray-400">Unlocking Soon</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">$24.5K</p>
            <p className="text-sm text-gray-400">Total Locked</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Users className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">579</p>
            <p className="text-sm text-gray-400">Recipients</p>
          </div>
        </div>

        {/* Vault Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <motion.div
              key={vault.id}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {vault.title}
                  </h3>
                  <p className="text-sm text-gray-400">by {vault.creator}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    vault.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {vault.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Locked Value</span>
                  <span className="text-white font-medium">
                    ${vault.locked}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Unlock Date</span>
                  <span className="text-white">{vault.unlockDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipients</span>
                  <span className="text-white">{vault.recipients}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-purple-400">{vault.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${vault.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleManageVault(vault.id)}
                  className="flex-1 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition text-center"
                >
                  Manage
                </button>
                <button
                  onClick={() => handleUnlockVault(vault.id)}
                  className="flex-1 py-2 bg-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/30 transition flex items-center justify-center"
                >
                  <Unlock className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
