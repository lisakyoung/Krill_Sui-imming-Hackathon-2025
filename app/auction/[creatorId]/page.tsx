"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Gavel,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
  Plus,
  Minus,
  Info,
  Star,
  CheckCircle,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function JoinAuctionPage() {
  const router = useRouter();
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [bidAmount, setBidAmount] = useState(100);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");

  const auction = {
    creator: creatorId === "1" ? "Alex Rivers" : "Luna Park",
    title: "VIP Monthly Access",
    description: "Get exclusive monthly access with personalized perks",
    minBid: 50,
    maxBid: 1000,
    currentBids: 23,
    topBid: 850,
    averageBid: 320,
    slotsAvailable: 5,
    timeLeft: "2d 14h 35m",
  };

  const availablePerks = [
    { id: "call", label: "Monthly 1-on-1 Video Call", popular: true },
    { id: "early", label: "Early Access to Content", popular: true },
    { id: "behind", label: "Behind the Scenes Access", popular: false },
    { id: "merch", label: "Signed Merchandise", popular: false },
    { id: "shoutout", label: "Social Media Shoutout", popular: false },
    { id: "collab", label: "Collaboration Opportunity", popular: false },
  ];

  const handlePerkToggle = (perkId: string) => {
    setSelectedPerks((prev) =>
      prev.includes(perkId)
        ? prev.filter((id) => id !== perkId)
        : [...prev, perkId]
    );
  };

  const handlePlaceBid = () => {
    if (bidAmount < auction.minBid || bidAmount > auction.maxBid) {
      toast.error(
        `Bid must be between $${auction.minBid} and $${auction.maxBid}`
      );
      return;
    }

    // Store bid in localStorage
    const bidData = {
      id: Date.now(),
      creatorId,
      creatorName: auction.creator,
      auctionTitle: auction.title,
      amount: bidAmount,
      perks: selectedPerks,
      customRequest,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existingBids = JSON.parse(localStorage.getItem("userBids") || "[]");
    existingBids.push(bidData);
    localStorage.setItem("userBids", JSON.stringify(existingBids));

    // Update active vaults count
    const currentVaults = parseInt(localStorage.getItem("activeVaults") || "8");
    localStorage.setItem("activeVaults", (currentVaults + 1).toString());

    toast.success(
      "Bid placed successfully! The creator will review your offer."
    );

    // Navigate to bid confirmation page
    localStorage.setItem("latestBid", JSON.stringify(bidData));
    router.push("/auction-result");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="glass-effect rounded-2xl p-8 mb-6">
          {/* Auction Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {auction.title}
              </h1>
              <p className="text-gray-400 mb-4">by {auction.creator}</p>
              <p className="text-gray-300">{auction.description}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2 text-orange-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{auction.timeLeft}</span>
              </div>
              <p className="text-sm text-gray-400">
                {auction.slotsAvailable} slots left
              </p>
            </div>
          </div>

          {/* Auction Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Min Bid</p>
              <p className="text-xl font-bold text-white">${auction.minBid}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Top Bid</p>
              <p className="text-xl font-bold text-green-400">
                ${auction.topBid}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Average</p>
              <p className="text-xl font-bold text-white">
                ${auction.averageBid}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Bids</p>
              <p className="text-xl font-bold text-white">
                {auction.currentBids}
              </p>
            </div>
          </div>

          {/* Bid Amount */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Your Bid Amount (USD/month)
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setBidAmount(Math.max(auction.minBid, bidAmount - 10))
                }
                className="w-12 h-12 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center justify-center"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>

              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) =>
                    setBidAmount(parseInt(e.target.value) || auction.minBid)
                  }
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={() =>
                  setBidAmount(Math.min(auction.maxBid, bidAmount + 10))
                }
                className="w-12 h-12 bg-white/5 rounded-xl hover:bg-white/10 transition flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex justify-between mt-4">
              {[100, 250, 500, 750].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBidAmount(preset)}
                  className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-white"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Perk Selection */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Select Desired Perks
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availablePerks.map((perk) => (
                <button
                  key={perk.id}
                  onClick={() => handlePerkToggle(perk.id)}
                  className={`p-4 rounded-xl border transition text-left ${
                    selectedPerks.includes(perk.id)
                      ? "bg-purple-500/20 border-purple-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-medium">{perk.label}</p>
                      {perk.popular && (
                        <span className="text-xs text-yellow-400 mt-1 inline-flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </span>
                      )}
                    </div>
                    {selectedPerks.includes(perk.id) && (
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Request */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Custom Request (Optional)
            </label>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Any special requests or preferences..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
            />
          </div>

          {/* Bid Summary */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Bid Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly bid amount</span>
                <span className="text-white font-semibold">${bidAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selected perks</span>
                <span className="text-white">{selectedPerks.length} perks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auction ends in</span>
                <span className="text-orange-400">{auction.timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 bg-white/5 rounded-xl text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <GlowingButton onClick={handlePlaceBid} className="flex-1">
              <Gavel className="w-5 h-5 mr-2" />
              Place Bid
            </GlowingButton>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium mb-1">How it works</p>
              <p className="text-xs text-gray-300">
                After the auction ends, the creator will review all bids and
                select winners based on bid amount and requested perks. You'll
                be notified if your bid is accepted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
