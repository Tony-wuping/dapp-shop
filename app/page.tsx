"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  // 这里使用了 useSearchParams，但因为我们使用了 Suspense 包裹（见下方说明），
  // 实际上 Next.js 的构建流程会处理它，或者我们可以通过 window 对象安全获取。
  // 为了彻底消除构建时的 "useSearchParams" 警告，我们保持你原来的 window.location 逻辑，
  // 这样在服务器端构建时不会报错，同时在客户端能完美运行。
  
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    // 这里的代码确保只在浏览器端执行
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || "";

    if (ref) {
      localStorage.setItem("inviteRef", ref);
      setRefCode(ref);
    } else {
      const savedRef = localStorage.getItem("inviteRef") || "";
      setRefCode(savedRef);
    }
  }, []);

  const goRegister = () => {
    if (refCode) {
      router.push(`/register?ref=${refCode}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">DApp 商城</h1>
            <p className="mt-1 text-sm text-white/60">区块链风格商城演示页</p>
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
          >
            连接钱包
          </Link>
        </header>

        <section className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-6">
          <h2 className="text-2xl font-bold text-white">欢迎来到 DApp 商城</h2>
          <p className="mt-3 text-sm text-white/75">
            这是一个可以运行的商城首页。后面会继续接入：钱包登录、推荐码、注册资料、订单、个人中心。
          </p>

          {refCode ? (
            <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-200">
              当前检测到推荐码：<span className="font-semibold">{refCode}</span>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              当前没有检测到推荐码。
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={goRegister}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              去注册
            </button>

            <Link
              href="/orders"
              className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              我的订单
            </Link>

            <Link
              href="/profile"
              className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              个人中心
            </Link>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-cyan-300">
            首页
          </Link>
          <Link href="/orders" className="text-sm text-white/70 hover:text-cyan-300">
            我的订单
          </Link>
          <Link href="/profile" className="text-sm text-white/70 hover:text-cyan-300">
            个人中心
          </Link>
        </div>
      </nav>
    </main>
  );
}