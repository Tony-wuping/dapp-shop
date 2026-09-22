"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type Member = {
  nickname: string;
  referralCode: string;
  invitedBy: string;
  address: string;
};

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function ProfilePage() {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [nickname, setNickname] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [address, setAddress] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname") || "";
    const savedReferralCode = localStorage.getItem("referralCode") || "";
    const savedAddress = localStorage.getItem("address") || "";
    const savedInvitedBy = localStorage.getItem("invitedBy") || "";

    setNickname(savedNickname);
    setReferralCode(savedReferralCode);
    setAddress(savedAddress);
    setInvitedBy(savedInvitedBy);

    const loadMembers = () => {
      const data = JSON.parse(localStorage.getItem("members") || "[]");
      setMembers(data);
    };

    loadMembers();

    const initWallet = async () => {
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
        }

        setNetwork(chainId);
      } catch (error) {
        console.error(error);
      }
    };

    initWallet();

    if (!savedReferralCode) {
      const newCode = randomCode();
      setReferralCode(newCode);
      localStorage.setItem("referralCode", newCode);
    }
  }, []);

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

  const saveProfile = () => {
    const finalReferralCode = referralCode || randomCode();

    const member: Member = {
      nickname,
      referralCode: finalReferralCode,
      invitedBy,
      address,
    };

    const list: Member[] = JSON.parse(localStorage.getItem("members") || "[]");
    const myIndex = list.findIndex((x) => x.referralCode === finalReferralCode);

    if (myIndex >= 0) {
      list[myIndex] = member;
    } else {
      list.unshift(member);
    }

    localStorage.setItem("members", JSON.stringify(list));
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("referralCode", finalReferralCode);
    localStorage.setItem("address", address);
    localStorage.setItem("invitedBy", invitedBy);

    setReferralCode(finalReferralCode);
    setMembers(list);

    alert("资料已保存");
  };

  const myInviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/?ref=${referralCode || "未生成"}`;
  }, [referralCode]);

  const myChildren = members.filter((m) => m.invitedBy === referralCode);
  const secondLevel = members.filter((m) =>
    myChildren.some((child) => child.referralCode === m.invitedBy)
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">个人中心</h1>
            <p className="mt-1 text-sm text-white/60">查看和修改你的资料</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
          >
            返回首页
          </Link>
        </div>

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">钱包信息</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>
              当前钱包：
              {account ? (
                <span className="ml-2 text-white">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              ) : (
                <span className="ml-2 text-yellow-300">未连接</span>
              )}
            </p>
            <p>
              当前网络：
              <span className="ml-2 text-white">{network || "未连接"}</span>
            </p>
          </div>

          <button
            onClick={connectWallet}
            className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            连接/切换钱包
          </button>
        </section>

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">我的推荐信息</h2>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">我的推荐码</label>
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">我的推广链接</label>
              <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-cyan-300 break-all">
                {myInviteLink}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">我的上级推荐码</label>
              <input
                value={invitedBy}
                onChange={(e) => setInvitedBy(e.target.value)}
                placeholder="如果你是通过链接进入，这里会自动带入"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">修改资料</h2>

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
              <label className="mb-2 block text-sm text-white/70">收货地址</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="请输入收货地址"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            保存资料
          </button>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-cyan-300">我的层级关系</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
              <div className="font-semibold text-white">一级下级</div>
              <div className="mt-2 text-white/70">
                {myChildren.length === 0 ? (
                  "暂无"
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {myChildren.map((m, idx) => (
                      <li key={idx}>
                        {m.nickname || "未命名"} / {m.referralCode}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
              <div className="font-semibold text-white">二级下级</div>
              <div className="mt-2 text-white/70">
                {secondLevel.length === 0 ? (
                  "暂无"
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {secondLevel.map((m, idx) => (
                      <li key={idx}>
                        {m.nickname || "未命名"} / {m.referralCode}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-3">
          <Link href="/" className="text-sm text-white/70 hover:text-cyan-300">
            首页
          </Link>
          <Link href="/orders" className="text-sm text-white/70 hover:text-cyan-300">
            我的订单
          </Link>
          <Link href="/profile" className="text-sm text-cyan-300">
            个人中心
          </Link>
        </div>
      </nav>
    </main>
  );
}