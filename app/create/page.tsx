"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Upload,
  Sparkles,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Check,
  Users,
  GitBranch,
  Lock,
  Image,
  Video,
  Music,
  FileText,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    contentTitle: "",
    bio: "",
    categories: [] as string[],
    sharePrice: 10,
    enableEvolution: true,
    subscriptionModel: "free",
    uploadedContent: null as any,
  });

  const steps = [
    { id: 1, name: "Content Upload", icon: Upload },
    { id: 2, name: "Basic Info", icon: Users },
    { id: 3, name: "Content Strategy", icon: Sparkles },
    { id: 4, name: "Monetization", icon: DollarSign },
    { id: 5, name: "Launch", icon: TrendingUp },
  ];

  const categories = [
    "Art",
    "Music",
    "Gaming",
    "Education",
    "Tech",
    "Lifestyle",
    "Entertainment",
    "Other",
  ];

  const handleFileUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setFormData({
          ...formData,
          uploadedContent: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: url,
            walrusCID: `bafybei${Math.random().toString(36).substring(2, 15)}`,
          },
        });
        toast.success("Content uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleCategoryToggle = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.includes(category)
        ? formData.categories.filter((c) => c !== category)
        : [...formData.categories, category],
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.uploadedContent) {
      toast.error("Please upload content first");
      return;
    }
    if (currentStep === 2 && !formData.contentTitle) {
      toast.error("Please add a title");
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleLaunch = () => {
    localStorage.setItem("creatorProfile", JSON.stringify(formData));

    // Track activity
    const trackActivity = (window as any).trackActivity;
    if (trackActivity) {
      trackActivity("content", "Published new content");
    }

    toast.success("Content published successfully!");

    if (formData.enableEvolution) {
      router.push("/creator-studio-evolution");
    } else {
      router.push("/creator-studio-standard");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Create Content</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-12 h-12 rounded-full
                ${currentStep >= step.id ? "bg-purple-500" : "bg-white/10"}
                transition-all duration-300
              `}
              >
                {currentStep > step.id ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <step.icon
                    className={`w-6 h-6 ${currentStep >= step.id ? "text-white" : "text-gray-400"}`}
                  />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  w-full h-0.5 mx-2
                  ${currentStep > step.id ? "bg-purple-500" : "bg-white/10"}
                `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-effect rounded-2xl p-8">
          {/* Step 1: Content Upload */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Upload Your Content
              </h2>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                  isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/20 hover:border-purple-500/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                />

                {!formData.uploadedContent ? (
                  <>
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Support for images, videos, audio files, and documents
                    </p>

                    {/* File Type Buttons */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition"
                      >
                        <Image className="w-6 h-6 text-purple-400" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition"
                      >
                        <Video className="w-6 h-6 text-purple-400" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition"
                      >
                        <Music className="w-6 h-6 text-purple-400" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition"
                      >
                        <FileText className="w-6 h-6 text-purple-400" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="max-w-md mx-auto">
                    {/* Preview uploaded content */}
                    {formData.uploadedContent.type.startsWith("image") && (
                      <img
                        src={formData.uploadedContent.url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    {formData.uploadedContent.type.startsWith("video") && (
                      <video
                        src={formData.uploadedContent.url}
                        controls
                        className="w-full h-48 rounded-lg mb-4"
                      />
                    )}
                    {formData.uploadedContent.type.startsWith("audio") && (
                      <div className="bg-white/5 rounded-lg p-6 mb-4">
                        <Music className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <audio
                          src={formData.uploadedContent.url}
                          controls
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-white mb-1">
                        {formData.uploadedContent.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Size:{" "}
                        {(formData.uploadedContent.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                      <p className="text-sm text-purple-400 mt-2">
                        Walrus CID: {formData.uploadedContent.walrusCID}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setFormData({ ...formData, uploadedContent: null })
                      }
                      className="mt-4 text-sm text-gray-400 hover:text-white transition"
                    >
                      Upload different file
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={formData.contentTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, contentTitle: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="Give your content a catchy title..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bio / Description
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-32 resize-none"
                    placeholder="Tell your story..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-3">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-4 py-2 rounded-full transition ${
                          formData.categories.includes(category)
                            ? "bg-purple-500 text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Step 3: Content Strategy */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Content Strategy
              </h2>

              <div className="space-y-6">
                <div
                  className={`p-6 border rounded-xl transition ${
                    formData.enableEvolution
                      ? "bg-purple-500/10 border-purple-500"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableEvolution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enableEvolution: e.target.checked,
                        })
                      }
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                    />
                    <div>
                      <p className="text-white font-medium mb-1">
                        Enable Evolution for this content
                      </p>
                      <p className="text-sm text-gray-400">
                        Allow your content to branch and evolve based on
                        community interaction
                      </p>
                    </div>
                  </label>
                </div>

                {formData.enableEvolution && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <GitBranch className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <p className="text-white">Community Remixes</p>
                        <p className="text-sm text-gray-400">
                          Let fans create their own versions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-white">Build your subscriber base</p>
                        <p className="text-sm text-gray-400">
                          Engage directly with your audience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white">Encrypted with Seal</p>
                        <p className="text-sm text-gray-400">
                          Your content is secure and protected
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {/* Step 4: Monetization */}
          // Update Step 4 in your existing create/page.tsx
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Monetization
              </h2>

              <div className="space-y-6">
                {/* Share Pricing */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <label className="block text-sm text-gray-400 mb-3">
                    Initial Share Price
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <input
                      type="range"
                      value={formData.sharePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharePrice: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="1000"
                      className="flex-1"
                    />
                    <div className="px-4 py-2 bg-purple-500/20 rounded-lg min-w-[100px] text-center">
                      <span className="text-2xl font-bold text-white">
                        ${formData.sharePrice}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Price will adjust based on demand using bonding curve
                  </p>
                </div>

                {/* Subscription Tiers */}
                <div>
                  <label className="block text-sm text-gray-400 mb-3">
                    Subscription Model
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        id: "free",
                        name: "Free",
                        price: 0,
                        features: ["Basic access", "Community features"],
                      },
                      {
                        id: "basic",
                        name: "Basic",
                        price: 5,
                        features: [
                          "All Free features",
                          "Early access",
                          "No ads",
                        ],
                      },
                      {
                        id: "premium",
                        name: "Premium",
                        price: 15,
                        features: [
                          "All Basic features",
                          "Exclusive content",
                          "Direct messaging",
                        ],
                      },
                      {
                        id: "vip",
                        name: "VIP",
                        price: 50,
                        features: [
                          "All Premium features",
                          "1-on-1 sessions",
                          "Custom requests",
                          "NFT drops",
                        ],
                      },
                    ].map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            subscriptionModel: tier.id,
                          })
                        }
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          formData.subscriptionModel === tier.id
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-white/5 border-white/10 hover:border-purple-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            {tier.name}
                          </span>
                          <span className="text-purple-400 font-bold">
                            ${tier.price}/mo
                          </span>
                        </div>
                        <div className="space-y-1">
                          {tier.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Split */}
                <div>
                  <label className="block text-sm text-gray-400 mb-3">
                    Revenue Split
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">Your earnings</span>
                      <span className="text-green-400 font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Platform fee</span>
                      <span className="text-gray-400">5%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: "95%" }}
                    />
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500"
                    />
                    <div>
                      <p className="text-white">Enable Tips</p>
                      <p className="text-xs text-gray-400">
                        Allow fans to send direct tips
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500"
                      defaultChecked
                    />
                    <div>
                      <p className="text-white">Time Vaults</p>
                      <p className="text-xs text-gray-400">
                        Create scheduled content releases
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500"
                      defaultChecked
                    />
                    <div>
                      <p className="text-white">NFT Rewards</p>
                      <p className="text-xs text-gray-400">
                        Reward top supporters with NFTs
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
          {/* Step 5: Launch */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-semibold text-white mb-4">
                Ready to Launch!
              </h2>
              <p className="text-gray-400 mb-8">
                Your content is ready to be shared with the world
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Content uploaded to Walrus</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">
                    Profile information complete
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">
                    {formData.enableEvolution
                      ? "Evolution enabled"
                      : "Standard content"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Monetization configured</span>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "creatorProfile",
                      JSON.stringify(formData)
                    );
                    router.push("/creator/1");
                  }}
                  className="flex-1 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                >
                  Preview Profile
                </button>
                <GlowingButton onClick={handleLaunch} className="flex-1">
                  Launch Content 🚀
                </GlowingButton>
              </div>
            </motion.div>
          )}
          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <GlowingButton onClick={handleNextStep}>
                Next <ChevronRight className="w-5 h-5 ml-2 inline" />
              </GlowingButton>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
