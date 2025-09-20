"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Users,
  Shield,
  Key,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function AccessControlPage() {
  const router = useRouter();
  const [accessRules, setAccessRules] = useState({
    visibility: "public", // public, private, subscribers
    requireSubscription: false,
    minimumTier: "free",
    geoRestrictions: [] as string[],
    ageRestriction: 0,
    whitelistedUsers: [] as string[],
    blacklistedUsers: [] as string[],
    encryptionEnabled: true,
  });

  const [newWhitelist, setNewWhitelist] = useState("");
  const [newBlacklist, setNewBlacklist] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "South Korea",
  ];

  const handleSave = () => {
    localStorage.setItem("accessControl", JSON.stringify(accessRules));
    toast.success("Access control settings saved!");

    const trackActivity = (window as any).trackActivity;
    if (trackActivity) {
      trackActivity("settings", "Updated access control");
    }
  };

  const addToWhitelist = () => {
    if (newWhitelist && !accessRules.whitelistedUsers.includes(newWhitelist)) {
      setAccessRules({
        ...accessRules,
        whitelistedUsers: [...accessRules.whitelistedUsers, newWhitelist],
      });
      setNewWhitelist("");
      toast.success("User added to whitelist");
    }
  };

  const addToBlacklist = () => {
    if (newBlacklist && !accessRules.blacklistedUsers.includes(newBlacklist)) {
      setAccessRules({
        ...accessRules,
        blacklistedUsers: [...accessRules.blacklistedUsers, newBlacklist],
      });
      setNewBlacklist("");
      toast.success("User added to blacklist");
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
              <h1 className="text-3xl font-bold text-white">Access Control</h1>
              <p className="text-gray-400">
                Manage who can access your content
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </GlowingButton>
        </div>

        {/* Visibility Settings */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Content Visibility
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-3">
                Access Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["public", "private", "subscribers"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setAccessRules({ ...accessRules, visibility: level })
                    }
                    className={`p-3 rounded-xl capitalize transition ${
                      accessRules.visibility === level
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {level === "public" && (
                      <Eye className="w-5 h-5 mx-auto mb-1" />
                    )}
                    {level === "private" && (
                      <Lock className="w-5 h-5 mx-auto mb-1" />
                    )}
                    {level === "subscribers" && (
                      <Users className="w-5 h-5 mx-auto mb-1" />
                    )}
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {accessRules.visibility === "subscribers" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Minimum Subscription Tier
                </label>
                <select
                  value={accessRules.minimumTier}
                  onChange={(e) =>
                    setAccessRules({
                      ...accessRules,
                      minimumTier: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="free">Free Tier</option>
                  <option value="basic">Basic Tier</option>
                  <option value="premium">Premium Tier</option>
                  <option value="vip">VIP Tier</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* User Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Whitelist</h3>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newWhitelist}
                onChange={(e) => setNewWhitelist(e.target.value)}
                placeholder="Add wallet address..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={addToWhitelist}
                className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {accessRules.whitelistedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg"
                >
                  <span className="text-sm text-white font-mono truncate">
                    {user}
                  </span>
                  <button
                    onClick={() =>
                      setAccessRules({
                        ...accessRules,
                        whitelistedUsers: accessRules.whitelistedUsers.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {accessRules.whitelistedUsers.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No whitelisted users
                </p>
              )}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Blacklist</h3>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newBlacklist}
                onChange={(e) => setNewBlacklist(e.target.value)}
                placeholder="Add wallet address..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={addToBlacklist}
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {accessRules.blacklistedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg"
                >
                  <span className="text-sm text-white font-mono truncate">
                    {user}
                  </span>
                  <button
                    onClick={() =>
                      setAccessRules({
                        ...accessRules,
                        blacklistedUsers: accessRules.blacklistedUsers.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {accessRules.blacklistedUsers.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No blacklisted users
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Restrictions */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Additional Restrictions
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Age Restriction
              </label>
              <select
                value={accessRules.ageRestriction}
                onChange={(e) =>
                  setAccessRules({
                    ...accessRules,
                    ageRestriction: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="0">No age restriction</option>
                <option value="13">13+ years</option>
                <option value="16">16+ years</option>
                <option value="18">18+ years</option>
                <option value="21">21+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Geographic Restrictions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {countries.map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={accessRules.geoRestrictions.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAccessRules({
                            ...accessRules,
                            geoRestrictions: [
                              ...accessRules.geoRestrictions,
                              country,
                            ],
                          });
                        } else {
                          setAccessRules({
                            ...accessRules,
                            geoRestrictions: accessRules.geoRestrictions.filter(
                              (c) => c !== country
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-purple-500"
                    />
                    <span className="text-sm text-white">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Enable Encryption</p>
                <p className="text-sm text-gray-400">
                  Secure content with Seal encryption
                </p>
              </div>
              <input
                type="checkbox"
                checked={accessRules.encryptionEnabled}
                onChange={(e) =>
                  setAccessRules({
                    ...accessRules,
                    encryptionEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Security Status */}
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Shield
              className={`w-6 h-6 ${accessRules.encryptionEnabled ? "text-green-400" : "text-yellow-400"}`}
            />
            <div>
              <p className="text-white font-medium">Security Status</p>
              <p className="text-sm text-gray-400">
                {accessRules.encryptionEnabled
                  ? "Content is encrypted and secured with Seal"
                  : "Content is not encrypted - consider enabling encryption"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
