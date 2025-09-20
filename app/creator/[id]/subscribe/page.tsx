"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  Zap,
  Check,
  Lock,
  ArrowLeft,
  Wallet,
  Shield,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  nftImage: string;
  benefits: string[];
  supply: number;
  minted: number;
  color: string;
  icon: any;
}

export default function SubscribePage({
  params,
}: {
  params: { username: string };
}) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: "bronze",
      name: "Bronze Supporter",
      price: 5,
      nftImage: "/nft-bronze.png",
      benefits: [
        "Access to exclusive content",
        "Bronze NFT badge",
        "Community chat access",
        "Monthly newsletter",
      ],
      supply: 1000,
      minted: 234,
      color: "from-orange-600 to-orange-400",
      icon: Shield,
    },
    {
      id: "silver",
      name: "Silver Member",
      price: 15,
      nftImage: "/nft-silver.png",
      benefits: [
        "All Bronze benefits",
        "Early access to new content",
        "Silver NFT badge",
        "Direct messaging",
        "Voting rights",
        "Monthly AMA access",
      ],
      supply: 500,
      minted: 89,
      color: "from-gray-400 to-gray-200",
      icon: Star,
    },
    {
      id: "gold",
      name: "Gold VIP",
      price: 50,
      nftImage: "/nft-gold.png",
      benefits: [
        "All Silver benefits",
        "Gold NFT badge",
        "1-on-1 monthly call",
        "Custom content requests",
        "Behind-the-scenes access",
        "Physical merchandise",
        "Whitelist for drops",
      ],
      supply: 100,
      minted: 12,
      color: "from-yellow-500 to-yellow-300",
      icon: Crown,
    },
  ];

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress");
    setWalletConnected(!!wallet);
  }, []);

  const handleMintNFT = async (tier: SubscriptionTier) => {
    if (!walletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      // Call your Sui Move contract to mint subscription NFT
      const mintNFT = async () => {
        // This would integrate with your Move contracts
        const response = await fetch("/api/mint-subscription-nft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creator: params.username,
            tier: tier.id,
            price: tier.price,
            walletAddress: localStorage.getItem("walletAddress"),
          }),
        });

        if (!response.ok) throw new Error("Minting failed");
        return response.json();
      };

      const result = await mintNFT();

      toast.success(`Successfully minted ${tier.name} NFT!`);

      // Store subscription in localStorage for demo
      const subscriptions = JSON.parse(
        localStorage.getItem("userSubscriptions") || "[]"
      );
      subscriptions.push({
        creator: params.username,
        tier: tier.id,
        nftId: result.nftId || `nft-${Date.now()}`,
        mintedAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
      localStorage.setItem("userSubscriptions", JSON.stringify(subscriptions));

      router.push("/viewer/subscriptions");
    } catch (error) {
      toast.error("Failed to mint NFT. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                Subscribe to {params.username}
              </h1>
              <p className="text-gray-400">
                Choose your membership tier and mint your NFT
              </p>
            </div>
          </div>

          {!walletConnected && (
            <button
              onClick={() =>
                document.getElementById("connect-wallet-btn")?.click()
              }
              className="px-4 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        {/* NFT Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;

            return (
              <motion.div
                key={tier.id}
                whileHover={{ y: -5 }}
                className={`relative glass-effect rounded-2xl p-6 cursor-pointer transition ${
                  isSelected ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Popular badge for silver */}
                {tier.id === "silver" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 rounded-full text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                {/* NFT Preview */}
                <div
                  className={`h-48 bg-gradient-to-br ${tier.color} rounded-xl mb-4 flex items-center justify-center`}
                >
                  <Icon className="w-24 h-24 text-white/80" />
                </div>

                {/* Tier Info */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${tier.price}
                  </span>
                  <span className="text-gray-400 ml-2">SUI/month</span>
                </div>

                {/* Supply Info */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Minted</span>
                    <span className="text-white">
                      {tier.minted}/{tier.supply}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(tier.minted / tier.supply) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Mint Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMintNFT(tier);
                  }}
                  disabled={loading || tier.minted >= tier.supply}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    tier.minted >= tier.supply
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  {tier.minted >= tier.supply
                    ? "Sold Out"
                    : `Mint for ${tier.price} SUI`}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Comparison */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Instant Access</h3>
              <p className="text-sm text-gray-400">
                Start watching exclusive content immediately after minting
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">NFT Ownership</h3>
              <p className="text-sm text-gray-400">
                Your subscription is a tradeable NFT you truly own
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Exclusive Perks</h3>
              <p className="text-sm text-gray-400">
                Unlock benefits based on your membership tier
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
