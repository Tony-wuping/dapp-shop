"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type OrderItem = {
  id: string;
  name: string;
  price: string;
  status: string;
  time: string;
};

const products = [
  {
    id: 1,
    name: "示例商品 A",
    price: "12 USDT",
    stock: 20,
    desc: "区块链风格的商品展示卡片。",
  },
  {
    id: 2,
    name: "示例商品 B",
    price: "25 USDT",
    stock: 8,
    desc: "后面可以接入真实支付与订单。",
  },
  {
    id: 3,
    name: "示例商品 C",
    price: "18 USDT",
    stock: 15,
    desc: "支持钱包连接、推荐码、地址填写。",
  },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [nickname, setNickname] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [address, setAddress] = useState("");
  const [invitedBy, setInvitedBy] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("请先安装 MetaMask 钱包插件");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAccount(accounts[0]);
      setNetwork(chainId);
    } catch (error) {
      console.error(error);
      alert("连接钱包失败");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setNetwork(chainId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    const savedNickname = localStorage.getItem("nickname") || "";
    const savedReferralCode = localStorage.getItem("referralCode") || "";
    const savedAddress = localStorage.getItem("address") || "";
    const savedInvitedBy = localStorage.getItem("invitedBy") || "";

    setNickname(savedNickname);
    setReferralCode(savedReferralCode);
    setAddress(savedAddress);
    setInvitedBy(savedInvitedBy);

    const ref = searchParams.get("ref");
    if (ref && !savedInvitedBy) {
      setInvitedBy(ref);
      localStorage.setItem("invitedBy", ref);
    }
  }, [searchParams]);

  const saveProfile = () => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("referralCode", referralCode);
    localStorage.setItem("address", address);
    localStorage.setItem("invitedBy", invitedBy);
    alert("资料已保存");
  };

  const createOrder = (product: (typeof products)[number]) => {
    const order: OrderItem = {
      id: `ORD-${Date.now()}`,
      name: product.name,
      price: product.price,
      status: "待支付",
      time: new Date().toLocaleString("zh-CN"),
    };

    const oldOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    oldOrders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(oldOrders));

    router.push("/orders");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">DApp 商城</h1>
            <p className="mt-1 text-sm text-white/60">区块链风格商品演示页</p>
          </div>

          <div className="flex items-center gap-3">
            {account ? (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm">
                <div className="text-cyan-300">已连接钱包</div>
                <div className="text-white/70">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
              >
                连接钱包
              </button>
            )}
          </div>
        </header>

        <section className="mb-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <h2 className="text-2xl font-semibold">欢迎来到 DApp 商城</h2>
          <p className="mt-2 text-white/70">
            这个页面已经可以运行，后面我们会继续接入：
            钱包登录、中文昵称、推荐码、下单、支付、订单记录和后台管理。
          </p>
          <p className="mt-3 text-sm text-white/50">
            当前网络：{network ? network : "未连接"}
          </p>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">会员资料</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">中文昵称</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入中文昵称"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">推荐码</label>
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="请输入推荐码（可选）"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">我的邀请人推荐码</label>
              <input
                value={invitedBy}
                onChange={(e) => setInvitedBy(e.target.value)}
                placeholder="如果你是通过链接进入，这里会自动带入"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-white/70">收货地址</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="请输入收货地址"
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            保存资料
          </button>
        </section>

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">我的推广链接</h2>
          <p className="mt-3 text-sm text-white/70">
            你保存资料后，去个人中心会自动生成推荐码和推广链接。
          </p>
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-cyan-300">
            {typeof window !== "undefined"
              ? `${window.location.origin}/?ref=${referralCode || "未生成"}`
              : ""}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">商品列表</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
              >
                <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-cyan-500/40 to-blue-500/20" />
                <h3 className="text-lg font-bold text-cyan-300">{item.name}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-400">
                    {item.price}
                  </span>
                  <span className="text-sm text-white/50">库存：{item.stock}</span>
                </div>

                <button
                  onClick={() => createOrder(item)}
                  className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
                >
                  购买
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-3">
          <Link href="/" className="text-sm text-cyan-300">
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