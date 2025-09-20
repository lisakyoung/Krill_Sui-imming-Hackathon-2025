"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import {
  ArrowLeft,
  Crown,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  Download,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function ManageSubscriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [autoRenew, setAutoRenew] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleUpgradeTier = () => {
    router.push("/subscription-tiers");
  };

  const handleUpdatePayment = () => {
    toast.info("Opening payment settings...");
  };

  const handleDownloadInvoices = () => {
    toast.success("Downloading invoices...");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/subscriptions")}
            className="p-2 hover:bg-white/10 rounded-lg transition mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Manage Subscription
            </h1>
            <p className="text-gray-400">Alex Rivers - Premium Tier</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current Plan
            </h2>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-white">
                    Premium Tier
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  $15/month • Next billing: Feb 1, 2025
                </p>
              </div>
              <button
                onClick={handleUpgradeTier}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                Change Tier
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Subscription Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-white">Auto-Renewal</p>
                  <p className="text-sm text-gray-400">
                    Automatically renew subscription
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <p className="text-white">Notifications</p>
                  <p className="text-sm text-gray-400">
                    Get updates about new content
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleUpdatePayment}
              className="w-full p-4 glass-effect rounded-xl hover:bg-white/10 transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span className="text-white">Update Payment Method</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleDownloadInvoices}
              className="w-full p-4 glass-effect rounded-xl hover:bg-white/10 transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-green-400" />
                <span className="text-white">Download Invoices</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
