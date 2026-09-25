"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

function generateWalletAddress() {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("inviteRef", ref);
    }
  }, []);

  const handleConnectWallet = () => {
    const walletAddress = generateWalletAddress();

    localStorage.setItem(
      "user",
      JSON.stringify({
        walletAddress,
        isLogin: true,
      })
    );

    const ref = localStorage.getItem("inviteRef");
    router.push(ref ? `/register?ref=${ref}` : "/register");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-cyan-400">钱包登录</h1>
        <p className="mt-1 text-sm text-white/60">点击按钮连接钱包</p>

        <button
          onClick={handleConnectWallet}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          连接钱包
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/" className="text-white/60 hover:text-cyan-300">
            返回首页
          </Link>
          <Link href="/register" className="text-white/60 hover:text-cyan-300">
            去注册
          </Link>
        </div>
      </div>
    </main>
  );
}