"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Book,
  Code,
  FileText,
  Users,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DocsPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of Krill platform",
      action: () => toast.info("Documentation coming soon!"),
    },
    {
      icon: Code,
      title: "Developer Guide",
      description: "Build on Krill with our APIs",
      action: () => toast.info("API docs coming soon!"),
    },
    {
      icon: FileText,
      title: "Smart Contracts",
      description: "Explore our Sui Move contracts",
      action: () => window.open("https://github.com", "_blank"),
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our vibrant community",
      action: () => window.open("https://discord.com", "_blank"),
    },
  ];

  const quickLinks = [
    {
      label: "White Paper",
      action: () => toast.info("White paper will be available soon!"),
    },
    {
      label: "API Reference",
      action: () => toast.info("API documentation coming soon!"),
    },
    {
      label: "GitHub Repository",
      action: () => window.open("https://github.com", "_blank"),
    },
    {
      label: "Discord Community",
      action: () => window.open("https://discord.com", "_blank"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="container mx-auto px-4 py-20">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-xl text-gray-400 mb-12">
            Everything you need to know about Krill
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={section.action}
                className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition cursor-pointer text-left"
              >
                <Icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-400">{section.description}</p>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quick Links</h2>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={link.action}
                  className="text-purple-400 hover:text-purple-300 transition flex items-center space-x-2"
                >
                  <span>→ {link.label}</span>
                  {link.label.includes("GitHub") ||
                  link.label.includes("Discord") ? (
                    <ExternalLink className="w-3 h-3" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
