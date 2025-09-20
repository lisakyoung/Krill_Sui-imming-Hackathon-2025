"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sparkles,
  TrendingUp,
  Clock,
  Gavel,
  Wallet,
  User,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { formatAddress } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "Evolution Lab", href: "/evolution" },
  { icon: TrendingUp, label: "Stock Market", href: "/market" },
  { icon: Clock, label: "Time Vaults", href: "/vaults" },
  { icon: Gavel, label: "Auctions", href: "/auctions" },
  { icon: Wallet, label: "Portfolio", href: "/portfolio" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const account = useCurrentAccount();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const mockNotifications = [
    { id: 1, text: "Your content evolved to Level 24!", time: "2h ago" },
    { id: 2, text: "New bid on your auction", time: "5h ago" },
    { id: 3, text: "Time vault unlocking soon", time: "1d ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg" />
              <span className="text-xl font-bold text-white">Krill</span>
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators, content, or vaults..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Bell className="w-5 h-5 text-white" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-effect rounded-xl shadow-xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-white/5 transition cursor-pointer"
                      >
                        <p className="text-white text-sm">{notif.text}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        setNotifications(0);
                        setShowNotifications(false);
                      }}
                      className="text-purple-400 text-sm hover:text-purple-300 transition"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium">
                  <ConnectButton />
                </p>
              </div>

              <button
                onClick={() => router.push("/profile")}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              >
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-16 bottom-0 w-64 glass-effect border-r border-white/10 z-40 lg:z-30"
            >
              <div className="p-4 h-full flex flex-col">
                {/* Menu Items */}
                <div className="space-y-1 flex-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Section */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition flex items-center space-x-3"
                  >
                    <X className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 ${!isMobile ? "lg:ml-64" : ""}`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
