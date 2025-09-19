"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Users,
  Lock,
  CreditCard,
  Gift,
  Zap,
  Save,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function MonetizationSettingsPage() {
  const router = useRouter();
  const [sharePrice, setSharePrice] = useState(10);
  const [subscriptionTiers, setSubscriptionTiers] = useState([
    {
      name: "Basic",
      price: 5,
      perks: ["Access to content", "Monthly updates"],
    },
    {
      name: "Premium",
      price: 15,
      perks: ["All Basic perks", "Early access", "Exclusive content"],
    },
    {
      name: "VIP",
      price: 50,
      perks: ["All Premium perks", "1-on-1 sessions", "Custom requests"],
    },
  ]);
  const [revenueShare, setRevenueShare] = useState(90);

  const handleSave = () => {
    const profile = JSON.parse(localStorage.getItem("creatorProfile") || "{}");
    profile.sharePrice = sharePrice;
    profile.subscriptionTiers = subscriptionTiers;
    localStorage.setItem("creatorProfile", JSON.stringify(profile));

    toast.success("Monetization settings saved!");
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
                Monetization Settings
              </h1>
              <p className="text-gray-400">
                Configure how you earn from your content
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </GlowingButton>
        </div>

        {/* Share Pricing */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Share Pricing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-3">
                Initial Share Price
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  value={sharePrice}
                  onChange={(e) => setSharePrice(parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="flex-1"
                />
                <div className="px-4 py-2 bg-purple-500/20 rounded-lg min-w-[100px] text-center">
                  <span className="text-2xl font-bold text-white">
                    ${sharePrice}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Share price will fluctuate based on demand and engagement
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Subscription Tiers
          </h2>
          <div className="space-y-4">
            {subscriptionTiers.map((tier, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const newTiers = [...subscriptionTiers];
                      newTiers[index].name = e.target.value;
                      setSubscriptionTiers(newTiers);
                    }}
                    className="text-lg font-semibold bg-transparent text-white outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => {
                        const newTiers = [...subscriptionTiers];
                        newTiers[index].price = parseInt(e.target.value);
                        setSubscriptionTiers(newTiers);
                      }}
                      className="w-20 px-2 py-1 bg-white/10 rounded text-white text-center outline-none"
                    />
                    <span className="text-gray-400">/mo</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {tier.perks.map((perk, perkIndex) => (
                    <div
                      key={perkIndex}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-gray-300">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Settings */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Revenue Settings
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">
                  Your Revenue Share
                </label>
                <span className="text-white font-semibold">
                  {revenueShare}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${revenueShare}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Platform fee: {100 - revenueShare}%
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Payment Methods
          </h2>
          <div className="space-y-3">
            <button className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <div className="flex-1 text-left">
                <p className="text-white">Connect Bank Account</p>
                <p className="text-xs text-gray-400">Receive direct deposits</p>
              </div>
            </button>
            <button className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div className="flex-1 text-left">
                <p className="text-white">Crypto Wallet</p>
                <p className="text-xs text-gray-400">
                  Accept cryptocurrency payments
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
