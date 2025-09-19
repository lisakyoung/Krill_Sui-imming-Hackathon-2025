"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Upload,
  Image,
  Video,
  Music,
  Type,
  Palette,
  Layers,
  Settings,
  Eye,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function ContentEditorPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState<"media" | "text" | "style">("media");

  useEffect(() => {
    const savedProfile = localStorage.getItem("creatorProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setContent(profile.uploadedContent);
      setTitle(profile.contentTitle || "");
      setDescription(profile.bio || "");
    }
  }, []);

  const handleSave = () => {
    const savedProfile = JSON.parse(
      localStorage.getItem("creatorProfile") || "{}"
    );
    savedProfile.contentTitle = title;
    savedProfile.bio = description;
    localStorage.setItem("creatorProfile", JSON.stringify(savedProfile));

    toast.success("Changes saved successfully!");
    router.back();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newContent = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
          walrusCID: `bafybei${Math.random().toString(36).substring(2, 15)}`,
        };
        setContent(newContent);

        const savedProfile = JSON.parse(
          localStorage.getItem("creatorProfile") || "{}"
        );
        savedProfile.uploadedContent = newContent;
        localStorage.setItem("creatorProfile", JSON.stringify(savedProfile));

        toast.success("Content updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Content Editor</h1>
              <p className="text-gray-400">Edit and enhance your content</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => toast.info("Preview mode")}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <GlowingButton onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </GlowingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Mode Tabs */}
            <div className="glass-effect rounded-xl p-2 flex space-x-2">
              <button
                onClick={() => setEditMode("media")}
                className={`flex-1 p-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                  editMode === "media"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:bg-white/10"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Media</span>
              </button>
              <button
                onClick={() => setEditMode("text")}
                className={`flex-1 p-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                  editMode === "text"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:bg-white/10"
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Text</span>
              </button>
              <button
                onClick={() => setEditMode("style")}
                className={`flex-1 p-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                  editMode === "style"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:bg-white/10"
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Style</span>
              </button>
            </div>

            {/* Media Editor */}
            {editMode === "media" && (
              <div className="glass-effect rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Media Content
                </h2>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,audio/*"
                />

                {content ? (
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-xl p-4">
                      {content.type?.startsWith("image") && (
                        <img
                          src={content.url}
                          alt="Content"
                          className="w-full rounded-lg"
                        />
                      )}
                      {content.type?.startsWith("video") && (
                        <video
                          src={content.url}
                          controls
                          className="w-full rounded-lg"
                        />
                      )}
                      {content.type?.startsWith("audio") && (
                        <div className="p-8">
                          <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                          <audio
                            src={content.url}
                            controls
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
                    >
                      Replace Content
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-12 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500/50 transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Upload Content</p>
                  </button>
                )}
              </div>
            )}

            {/* Text Editor */}
            {editMode === "text" && (
              <div className="glass-effect rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Text Content
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Style Editor */}
            {editMode === "style" && (
              <div className="glass-effect rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Style Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Dark", "Light", "Auto"].map((theme) => (
                        <button
                          key={theme}
                          className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-white"
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-3">
                      Accent Color
                    </label>
                    <div className="flex space-x-3">
                      {[
                        "#8B5CF6",
                        "#EC4899",
                        "#10B981",
                        "#F59E0B",
                        "#3B82F6",
                      ].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Properties
              </h3>
              <div className="space-y-3">
                {content && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">File Name</p>
                      <p className="text-white">{content.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">File Size</p>
                      <p className="text-white">
                        {(content.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-white">{content.type}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition">
                  Add Effects
                </button>
                <button className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition">
                  Add Filters
                </button>
                <button className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition">
                  Crop & Resize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
