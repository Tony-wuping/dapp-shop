"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [walletAddress, setWalletAddress] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [inviterCode, setInviterCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.walletAddress) {
        setWalletAddress(user.walletAddress);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("inviteRef", ref);
      setInviterCode(ref);
    } else {
      const savedRef = localStorage.getItem("inviteRef") || "";
      setInviterCode(savedRef);
    }
  }, []);

  const referralCode = useMemo(() => {
    if (!walletAddress) return "";
    return walletAddress.slice(-6).toUpperCase();
  }, [walletAddress]);

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/?ref=${referralCode}`;
  }, [referralCode]);

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setMsg("推广链接已复制");
      setTimeout(() => {
        setCopied(false);
        setMsg("");
      }, 1500);
    } catch (error) {
      setMsg("复制失败，请手动复制");
    }
  };

  const handleRegister = () => {
    if (!walletAddress) {
      setMsg("没有找到钱包地址，请先连接钱包");
      return;
    }

    if (!nickname.trim()) {
      setMsg("请输入昵称");
      return;
    }

    const oldUserStr = localStorage.getItem("user");
    const oldUser = oldUserStr ? JSON.parse(oldUserStr) : {};

    const newUser = {
      ...oldUser,
      walletAddress,
      referralCode,
      nickname,
      email,
      phone,
      gender,
      birthday,
      country,
      province,
      city,
      address,
      inviterCode,
      isLogin: true,
      referralLink,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setMsg("注册成功");

    setTimeout(() => {
      router.push("/profile");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-cyan-400">注册</h1>
        <p className="mt-1 text-sm text-white/60">请填写你的个人资料</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">钱包地址</label>
            <input
              value={walletAddress}
              disabled
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white/60 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">昵称</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">联系邮箱</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="请输入联系邮箱"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">联系电话</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="请输入联系电话"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">性别</label>
              <input
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="例如：男 / 女"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">出生年月</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-white/70">国籍</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="国家"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">省份</label>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="省份"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">城市</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="城市"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">详细地址</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              rows={3}
              placeholder="请输入详细地址"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">我的推荐码</label>
            <input
              value={referralCode}
              disabled
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-cyan-300 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">我的推广链接</label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={referralLink}
                disabled
                className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-cyan-300 outline-none"
              />
              <button
                type="button"
                onClick={copyReferralLink}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                {copied ? "已复制" : "复制链接"}
              </button>
            </div>
            <p className="mt-2 text-xs text-white/50">
              这个链接可以发给别人，别人通过这个链接进入后会带上你的推荐码。
            </p>
          </div>

          {msg && <p className="text-sm text-yellow-300">{msg}</p>}

          <button
            onClick={handleRegister}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            完成注册
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/login" className="text-white/60 hover:text-cyan-300">
            返回登录
          </Link>
          <Link href="/" className="text-white/60 hover:text-cyan-300">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}