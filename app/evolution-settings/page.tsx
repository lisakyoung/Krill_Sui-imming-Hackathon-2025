"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitBranch,
  Sparkles,
  TrendingUp,
  Settings,
  Lock,
  Unlock,
  Save,
  Zap,
  Award,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function EvolutionSettingsPage() {
  const router = useRouter();
  const [evolutionRules, setEvolutionRules] = useState({
    evolutionEnabled: true,
    autoEvolve: false,
    evolutionThreshold: 100,
    maxBranches: 50,
    branchApproval: "automatic", // automatic, manual, community
    minEngagementScore: 75,
    evolutionSpeed: "medium", // slow, medium, fast
    rewardMultiplier: 1.5,
    allowCommunityBranches: true,
    requireVerification: false,
  });

  const handleSave = () => {
    localStorage.setItem("evolutionSettings", JSON.stringify(evolutionRules));
    toast.success("Evolution settings saved!");

    const trackActivity = (window as any).trackActivity;
    if (trackActivity) {
      trackActivity("settings", "Updated evolution rules");
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
                Evolution Settings
              </h1>
              <p className="text-gray-400">
                Configure how your content evolves
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </GlowingButton>
        </div>

        {/* Evolution Rules */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Evolution Rules
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Enable Evolution</p>
                <p className="text-sm text-gray-400">
                  Allow content to evolve and branch
                </p>
              </div>
              <input
                type="checkbox"
                checked={evolutionRules.evolutionEnabled}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    evolutionEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Auto-Evolution</p>
                <p className="text-sm text-gray-400">
                  Automatically evolve when threshold is met
                </p>
              </div>
              <input
                type="checkbox"
                checked={evolutionRules.autoEvolve}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    autoEvolve: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-white">Community Branches</p>
                <p className="text-sm text-gray-400">
                  Allow community to create evolution branches
                </p>
              </div>
              <input
                type="checkbox"
                checked={evolutionRules.allowCommunityBranches}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    allowCommunityBranches: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Evolution Parameters */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Evolution Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Evolution Threshold ({evolutionRules.evolutionThreshold}{" "}
                engagement points)
              </label>
              <input
                type="range"
                value={evolutionRules.evolutionThreshold}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    evolutionThreshold: parseInt(e.target.value),
                  })
                }
                min="50"
                max="500"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50 (Easy)</span>
                <span>500 (Hard)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Maximum Branches ({evolutionRules.maxBranches})
              </label>
              <input
                type="range"
                value={evolutionRules.maxBranches}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    maxBranches: parseInt(e.target.value),
                  })
                }
                min="10"
                max="100"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Evolution Speed
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["slow", "medium", "fast"].map((speed) => (
                  <button
                    key={speed}
                    onClick={() =>
                      setEvolutionRules({
                        ...evolutionRules,
                        evolutionSpeed: speed,
                      })
                    }
                    className={`p-3 rounded-xl capitalize transition ${
                      evolutionRules.evolutionSpeed === speed
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {speed === "slow" && "🐢"}
                    {speed === "medium" && "🚶"}
                    {speed === "fast" && "🚀"}
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Branch Approval
              </label>
              <select
                value={evolutionRules.branchApproval}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    branchApproval: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="automatic">
                  Automatic - No approval needed
                </option>
                <option value="manual">Manual - Creator approves</option>
                <option value="community">Community - Vote required</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rewards & Incentives */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Rewards & Incentives
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Reward Multiplier ({evolutionRules.rewardMultiplier}x)
              </label>
              <input
                type="range"
                value={evolutionRules.rewardMultiplier * 10}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    rewardMultiplier: parseInt(e.target.value) / 10,
                  })
                }
                min="10"
                max="30"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher multiplier = more rewards for successful evolutions
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Minimum Engagement Score ({evolutionRules.minEngagementScore}%)
              </label>
              <input
                type="range"
                value={evolutionRules.minEngagementScore}
                onChange={(e) =>
                  setEvolutionRules({
                    ...evolutionRules,
                    minEngagementScore: parseInt(e.target.value),
                  })
                }
                min="0"
                max="100"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Evolution Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-effect rounded-xl p-4">
            <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">Lv.23</p>
            <p className="text-sm text-gray-400">Current Level</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <GitBranch className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-sm text-gray-400">Active Branches</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">89%</p>
            <p className="text-sm text-gray-400">Evolution Rate</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
