"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  Upload,
  Image,
  Video,
  Music,
  FileText,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function UploadContentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
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
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    // Remove file size check - Walrus handles large files
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        url: e.target?.result,
        walrusCID: `bafybei${Math.random().toString(36).substring(2, 15)}`,
      });
      toast.success("File uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleMediaTypeClick = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleUploadContent = () => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    // Save to localStorage
    const contentData = {
      contentTitle: title,
      bio: description,
      uploadedContent: uploadedFile,
      categories: [],
      sharePrice: 10,
      enableEvolution: false,
      subscriptionModel: "free",
    };

    localStorage.setItem("creatorProfile", JSON.stringify(contentData));

    // Track activity
    const trackActivity = (window as any).trackActivity;
    if (trackActivity) {
      trackActivity("content", `Uploaded new content: ${title}`);
    }

    toast.success("Content uploaded successfully!");
    router.push("/creator-studio-standard");
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
              <h1 className="text-3xl font-bold text-white">Upload Content</h1>
              <p className="text-gray-400">
                Share your creation with the world
              </p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
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

            {!uploadedFile ? (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Max file size: 100MB
                </p>

                {/* Media Type Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleMediaTypeClick("image/*")}
                    className="p-4 bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition group"
                  >
                    <Image className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                  </button>
                  <button
                    onClick={() => handleMediaTypeClick("video/*")}
                    className="p-4 bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition group"
                  >
                    <Video className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                  </button>
                  <button
                    onClick={() => handleMediaTypeClick("audio/*")}
                    className="p-4 bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition group"
                  >
                    <Music className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                  </button>
                  <button
                    onClick={() => handleMediaTypeClick(".pdf,.doc,.docx")}
                    className="p-4 bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition group"
                  >
                    <FileText className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                  </button>
                </div>
              </>
            ) : (
              <div className="max-w-md mx-auto">
                {/* File Preview */}
                {uploadedFile.type.startsWith("image") && (
                  <img
                    src={uploadedFile.url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {uploadedFile.type.startsWith("video") && (
                  <video
                    src={uploadedFile.url}
                    controls
                    className="w-full h-48 rounded-lg mb-4"
                  />
                )}
                {uploadedFile.type.startsWith("audio") && (
                  <div className="bg-white/5 rounded-lg p-6 mb-4">
                    <Music className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <audio src={uploadedFile.url} controls className="w-full" />
                  </div>
                )}

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">{uploadedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content Details */}
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <GlowingButton
              onClick={handleUploadContent}
              className="w-full"
              disabled={!uploadedFile || !title}
            >
              Upload Content
            </GlowingButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
