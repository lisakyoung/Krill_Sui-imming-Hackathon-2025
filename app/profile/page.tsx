"use client";

import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Wallet,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  X,
  DollarSign,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
   const account = useCurrentAccount();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Mock data for detailed views
  const investmentDetails = [
    {
      creator: "Alex Rivers",
      amount: 3456,
      shares: 234,
      return: 12.5,
      status: "profit",
    },
    {
      creator: "Luna Park",
      amount: 2100,
      shares: 150,
      return: -5.2,
      status: "loss",
    },
    {
      creator: "Dev Master",
      amount: 5600,
      shares: 420,
      return: 23.4,
      status: "profit",
    },
    {
      creator: "Art Vision",
      amount: 1300,
      shares: 89,
      return: 8.7,
      status: "profit",
    },
  ];

  const subscriptionDetails = [
    {
      creator: "Alex Rivers",
      tier: "VIP",
      price: 50,
      since: "2024-01-15",
      perks: ["1-on-1 calls", "Early access"],
    },
    {
      creator: "Luna Park",
      tier: "Premium",
      price: 30,
      since: "2024-02-20",
      perks: ["Exclusive content"],
    },
    {
      creator: "Dev Master",
      tier: "Basic",
      price: 10,
      since: "2024-03-10",
      perks: ["Community access"],
    },
  ];

  const evolutionDetails = {
    currentLevel: 23,
    nextLevel: 24,
    progress: 78,
    achievements: [
      { name: "Early Adopter", level: 5, date: "2024-01-01" },
      { name: "Content Explorer", level: 10, date: "2024-02-15" },
      { name: "Evolution Master", level: 20, date: "2024-03-20" },
    ],
    recentEvolutions: [
      {
        content: "Genesis Story",
        action: "Triggered branch",
        date: "2 days ago",
      },
      {
        content: "Digital Dreams",
        action: "Discovered path",
        date: "5 days ago",
      },
    ],
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

        <div className="glass-effect rounded-2xl p-8 mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {user?.name || "Demo User"}
              </h2>
              <p className="text-gray-400">
                {user?.email || "demo@example.com"}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Wallet className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">
                  {account?.address || "0x1234...5678"}
                </span>
              </div>
            </div>
          </div>

          {/* Clickable Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              onClick={() => setActiveModal("investments")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-white">$12,456</p>
              <p className="text-xs text-green-400 mt-1">+15.2% return</p>
            </motion.button>

            <motion.button
              onClick={() => setActiveModal("subscriptions")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-gray-400 mt-1">$190/month</p>
            </motion.button>

            <motion.button
              onClick={() => setActiveModal("evolution")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Evolution Level</p>
              <p className="text-2xl font-bold text-white">Lv.23</p>
              <p className="text-xs text-purple-400 mt-1">78% to next</p>
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setActiveModal("settings")}
            className="w-full glass-effect rounded-xl p-4 text-left hover:bg-white/10 transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-white">Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full glass-effect rounded-xl p-4 text-left hover:bg-red-500/10 transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal: Investment Details */}
      <AnimatePresence>
        {activeModal === "investments" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Investment Portfolio
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-xl font-bold text-white">$12,456</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Current Value</p>
                  <p className="text-xl font-bold text-green-400">$14,350</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Total Return</p>
                  <p className="text-xl font-bold text-green-400">+15.2%</p>
                </div>
              </div>

              <div className="space-y-3">
                {investmentDetails.map((inv, index) => (
                  <div
                    key={index}
                    className="glass-effect rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-medium">{inv.creator}</p>
                      <p className="text-sm text-gray-400">
                        {inv.shares} shares
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">
                        ${inv.amount.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm flex items-center justify-end space-x-1 ${
                          inv.return > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {inv.return > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{Math.abs(inv.return)}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-3">
                <GlowingButton
                  className="flex-1"
                  onClick={() => {
                    setActiveModal(null);
                    router.push("/market");
                  }}
                >
                  Trade Stocks
                </GlowingButton>
                <button
                  className="flex-1 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition"
                  onClick={() => {
                    setActiveModal(null);
                    router.push("/portfolio");
                  }}
                >
                  View Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Subscription Details */}
        {activeModal === "subscriptions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Active Subscriptions
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                {subscriptionDetails.map((sub, index) => (
                  <div key={index} className="glass-effect rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-medium">{sub.creator}</p>
                        <p className="text-sm text-gray-400">
                          Since {sub.since}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                          {sub.tier}
                        </span>
                        <p className="text-white mt-1">${sub.price}/mo</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sub.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <GlowingButton
                  className="w-full"
                  onClick={() => {
                    setActiveModal(null);
                    router.push("/explore");
                  }}
                >
                  Browse More Creators
                </GlowingButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Evolution Details */}
        {activeModal === "evolution" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Evolution Progress
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Level Progress</span>
                  <span className="text-purple-400">
                    Level {evolutionDetails.currentLevel} →{" "}
                    {evolutionDetails.nextLevel}
                  </span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${evolutionDetails.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {evolutionDetails.progress}% complete
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Achievements
                </h3>
                <div className="space-y-2">
                  {evolutionDetails.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white">{achievement.name}</p>
                          <p className="text-xs text-gray-400">
                            Unlocked at Level {achievement.level}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {achievement.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {evolutionDetails.recentEvolutions.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white">{activity.content}</p>
                        <p className="text-xs text-gray-400">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {activity.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <GlowingButton
                  className="w-full"
                  onClick={() => {
                    setActiveModal(null);
                    router.push("/evolution");
                  }}
                >
                  Go to Evolution Lab
                </GlowingButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Settings */}
        {activeModal === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Account Settings
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() =>
                    toast.info("Email notifications settings coming soon!")
                  }
                  className="w-full p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition"
                >
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">
                    Manage email preferences
                  </p>
                </button>

                <button
                  onClick={() => toast.info("Privacy settings coming soon!")}
                  className="w-full p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition"
                >
                  <p className="text-white font-medium">Privacy</p>
                  <p className="text-sm text-gray-400">Control your data</p>
                </button>

                <button
                  onClick={() => toast.info("Security settings coming soon!")}
                  className="w-full p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition"
                >
                  <p className="text-white font-medium">Security</p>
                  <p className="text-sm text-gray-400">
                    Two-factor authentication
                  </p>
                </button>

                <button
                  onClick={() => toast.info("Wallet management coming soon!")}
                  className="w-full p-4 bg-white/5 rounded-xl text-left hover:bg-white/10 transition"
                >
                  <p className="text-white font-medium">Wallet</p>
                  <p className="text-sm text-gray-400">
                    Manage connected wallets
                  </p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
