"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import ZkLoginService from "@/lib/sui/zkLogin";
import { 
  ConnectButton,
  useSuiClient,
  useSignAndExecuteTransaction, } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  // ZkLoginService를 한 번만 생성하여 재사용합니다.
  const [zkLoginService] = useState(() => new ZkLoginService());
  const authHandled = useRef(false);

  // 1. 구글 OAuth redirect 이후 처리
  useEffect(() => {
    const handleAuthCallback = async () => {
      // StrictMode의 이중 호출을 방지하기 위해,
      // 아직 처리되지 않았고 URL에 id_token이 있을 때만 실행합니다.
      if (!authHandled.current && window.location.hash.includes("id_token")) {
        // 재진입을 막기 위해 플래그를 즉시 true로 설정합니다.
        authHandled.current = true;
        setIsLoading(true);

        try {
          // ZkLoginService를 통해 로그인 완료 처리를 합니다.
          const userData = await zkLoginService.completeZkLogin();

          // auth store에 사용자 정보를 저장합니다.
          // ZkLoginService가 반환하는 객체에는 userAddress, email, name 등이 포함됩니다.
          login({
            userAddress: userData.userAddress,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
          });

          toast.success("Welcome to Krill!");
          router.replace("/dashboard"); // URL hash 정리 후 대시보드 이동
        } catch (error) {
          console.error("Login completion error:", error);
          toast.error("Failed to complete login.");
          setIsLoading(false);
        }
      }
    };

    handleAuthCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. 구글 로그인 시작
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // ZkLoginService를 통해 Google 인증 URL을 생성하고 리디렉션합니다.
      const loginUrl = await zkLoginService.beginZkLogin();
      window.location.href = loginUrl;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* 헤더 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Krill
          </h1>
          <p className="text-gray-400">The Living Creator Economy</p>
        </motion.div>

        {/* 로그인 카드 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-3xl p-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sign in to continue
          </h2>

          <div className="space-y-4">
            <ConnectButton />
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-950 text-gray-400">
                  Powered by Enoki zkLogin
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "No passwords needed",
                "Your keys, your content",
                "Instant access to Web3",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>

        {/* 홈으로 돌아가기 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}