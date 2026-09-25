"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserInfo = {
  walletAddress: string;
  nickname: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  country: string;
  province: string;
  city: string;
  address: string;
  referralCode: string;
  referralLink: string;
  inviterCode?: string;
  isLogin?: boolean;
};

type TeamInfo = {
  totalMembers: number;
  directMembers: number;
  secondLevelMembers: number;
  totalConsumption: string;
  todayConsumption: string;
  activeMembers: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const displayReferralLink = useMemo(() => {
    if (!user?.referralLink && user?.referralCode) {
      return `${window.location.origin}/?ref=${user.referralCode}`;
    }
    return user?.referralLink || "";
  }, [user]);

  // 这里先放一个默认团队数据，后面你接后台数据库时再替换成真实数据
  const team: TeamInfo = {
    totalMembers: 28,
    directMembers: 6,
    secondLevelMembers: 22,
    totalConsumption: "1,280.00 USDT",
    todayConsumption: "86.00 USDT",
    activeMembers: 19,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">个人中心</h1>
            <p className="mt-1 text-sm text-white/60">查看和管理你的个人资料与团队数据</p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
          >
            返回首页
          </Link>
        </div>

        {!user ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
            暂时没有找到个人资料，请先完成注册。
            <div className="mt-4">
              <Link
                href="/register"
                className="inline-block rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
              >
                去注册
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 个人资料卡 */}
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <Row label="钱包地址" value={user.walletAddress} />
              <Row label="昵称" value={user.nickname} />
              <Row label="联系邮箱" value={user.email} />
              <Row label="联系电话" value={user.phone} />
              <Row label="性别" value={user.gender} />
              <Row label="出生年月" value={user.birthday} />
              <Row label="国籍" value={user.country} />
              <Row label="省份" value={user.province} />
              <Row label="城市" value={user.city} />
              <Row label="详细地址" value={user.address} />
              <Row label="我的推荐码" value={user.referralCode} />
              <Row label="我的推广链接" value={displayReferralLink} />
              <Row label="邀请人推荐码" value={user.inviterCode || "-"} />
            </div>

            {/* 团队概况 */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-6">
              <h2 className="text-xl font-bold text-cyan-300">我的团队概况</h2>
              <p className="mt-1 text-sm text-white/60">展示你的团队人数和消费情况</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="团队总人数" value={team.totalMembers.toString()} />
                <StatCard title="直推人数" value={team.directMembers.toString()} />
                <StatCard title="间推人数" value={team.secondLevelMembers.toString()} />
                <StatCard title="活跃人数" value={team.activeMembers.toString()} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <AmountCard title="团队总消费金额" value={team.totalConsumption} />
                <AmountCard title="今日团队消费金额" value={team.todayConsumption} />
              </div>
            </div>

            {/* 团队架构 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold text-cyan-300">团队架构</h2>
              <p className="mt-1 text-sm text-white/60">先显示一个简单的层级结构，后面可以接真实后台数据</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
                  <div className="font-semibold text-cyan-200">我</div>
                  <div className="mt-1 text-sm text-white/70">
                    昵称：{user.nickname} ｜ 推荐码：{user.referralCode}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
                    <div className="font-semibold text-white">一级团队</div>
                    <div className="mt-2 text-sm text-white/70">
                      直推人数：{team.directMembers}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      直推消费：356.00 USDT
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
                    <div className="font-semibold text-white">二级团队</div>
                    <div className="mt-2 text-sm text-white/70">
                      间推人数：{team.secondLevelMembers}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      间推消费：924.00 USDT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-3">
          <Link href="/" className="text-sm text-white/70 transition hover:text-cyan-300">
            首页
          </Link>

          <Link href="/orders" className="text-sm text-white/70 transition hover:text-cyan-300">
            我的订单
          </Link>

          <Link href="/profile" className="text-sm font-semibold text-cyan-300">
            个人中心
          </Link>
        </div>
      </nav>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between">
      <span className="text-sm text-white/60">{label}</span>
      <span className="break-all text-sm text-white">{value || "-"}</span>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-bold text-cyan-300">{value}</div>
    </div>
  );
}

function AmountCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-bold text-green-400">{value}</div>
    </div>
  );
}