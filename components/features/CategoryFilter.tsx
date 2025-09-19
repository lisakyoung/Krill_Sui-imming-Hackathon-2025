"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All", color: "from-purple-500 to-pink-500" },
  { id: "music", label: "Music", color: "from-blue-500 to-cyan-500" },
  { id: "art", label: "Art", color: "from-green-500 to-emerald-500" },
  { id: "gaming", label: "Gaming", color: "from-red-500 to-orange-500" },
  { id: "tech", label: "Tech", color: "from-indigo-500 to-purple-500" },
  { id: "lifestyle", label: "Lifestyle", color: "from-pink-500 to-rose-500" },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(category.id)}
            className={`px-6 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selected === category.id
                ? "bg-gradient-to-r text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
            style={{
              backgroundImage:
                selected === category.id
                  ? `linear-gradient(to right, var(--tw-gradient-stops))`
                  : undefined,
            }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
