"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import {
  UploadCloud,
  FileText,
  ImageIcon,
  Video,
  Music,
  X,
  CheckCircle,
  Circle,
  Rocket,
} from "lucide-react";
import { uploadFileToWalrus } from "@/lib/walrusUtils";

interface FormData {
  file: {
    name: string;
    size: number;
    type: string;
    previewUrl: string;
    content: Uint8Array;
  } | null;
  title: string;
  description: string;
  categories: string[];
  enableEvolution: boolean;
  sharePrice: number;
  subscriptionModel: "free" | "freemium" | "premium";
}

const initialFormData: FormData = {
  file: null,
  title: "",
  description: "",
  categories: [],
  enableEvolution: false,
  sharePrice: 10,
  subscriptionModel: "free",
};

const categories = [
  "Art",
  "Music",
  "Video",
  "Writing",
  "Gaming",
  "Tech",
  "Education",
  "Podcast",
];

export default function CreatePage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const content = new Uint8Array(arrayBuffer);
      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl,
          content,
        },
      }));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.file) {
      toast.error("Please upload a content file.");
      return;
    }
    if (currentStep === 2 && (!formData.title || !formData.description)) {
      toast.error("Please fill in the title and description.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLaunch = async () => {
    if (!account) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!formData.file?.content) {
      toast.error("Please upload a content file first.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(
      "Launching your content... Please approve transactions in your wallet."
    );

    try {
      const { files } = await uploadFileToWalrus(
        formData.file.content,
        account.address,
        signAndExecute
      );

      const blobId = files[0]?.blobId;
      if (!blobId) {
        throw new Error("Failed to get Blob ID from Walrus.");
      }

      const finalContentData = {
        ...formData,
        file: { ...formData.file, content: "" }, // Don't store large content
        blobId: blobId,
        ownerAddress: account.address,
      };

      localStorage.setItem("creatorProfile", JSON.stringify(finalContentData));

      toast.success("Content launched successfully!", { id: toastId });

      router.push(
        formData.enableEvolution
          ? "/creator-studio-evolution"
          : "/creator-studio-standard"
      );
    } catch (error) {
      console.error("Launch failed:", error);
      toast.error("Failed to launch content. See console for details.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Content Upload
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Upload Your Content</h2>
            {!formData.file ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-300">
                  Drag & drop your file here, or click to browse
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                />
              </div>
            ) : (
              <div className="glass-effect p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">{formData.file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, file: null })}
                    className="p-1 rounded-full hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 2: // Basic Info
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
            <input
              type="text"
              placeholder="Content Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-white focus:ring-purple-500 focus:border-purple-500"
            />
            <textarea
              placeholder="Tell us about your content..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32 mb-4 text-white focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.categories.includes(cat)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        );
      case 3: // Content Strategy
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Content Strategy</h2>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableEvolution}
                onChange={(e) =>
                  setFormData({ ...formData, enableEvolution: e.target.checked })
                }
                className="h-5 w-5 rounded text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
              />
              <span className="text-lg font-medium text-white">
                Enable Evolution
              </span>
            </label>
            <p className="text-gray-400 mt-2">
              Allow your content to be remixed, built upon, and evolved by your
              community.
            </p>
          </div>
        );
      case 4: // Monetization
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Monetization</h2>
            <label className="block mb-2 text-gray-300">
              Initial Share Price: ${formData.sharePrice}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={formData.sharePrice}
              onChange={(e) =>
                setFormData({ ...formData, sharePrice: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <h3 className="text-lg font-semibold mt-6 mb-3">Subscription Model</h3>
            <div className="space-y-3">
              {["free", "freemium", "premium"].map((model) => (
                <label
                  key={model}
                  className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="subscriptionModel"
                    value={model}
                    checked={formData.subscriptionModel === model}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        subscriptionModel: model as any,
                      })
                    }
                    className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-white capitalize">{model}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 5: // Launch
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ready to Launch?</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                {formData.file ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500 mr-3" />
                )}
                Content Uploaded
              </li>
              <li className="flex items-center">
                {formData.title && formData.description ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500 mr-3" />
                )}
                Basic Info Added
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Strategy: {formData.enableEvolution ? "Evolution" : "Standard"}
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Monetization Set
              </li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl">
        <div className="glass-effect p-8 rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1 || isUploading}
            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentStep < 5 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={isUploading}
              className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Rocket className="h-5 w-5" />
              )}
              <span>Launch Content</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}