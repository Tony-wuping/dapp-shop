"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  price: string;
  status: string;
  time: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(saved);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">我的订单</h1>
            <p className="mt-1 text-sm text-white/60">查看你最近的购买记录</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black transition hover:bg-cyan-400"
          >
            返回首页
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
            暂时还没有订单，去首页买点东西吧。
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-cyan-300">
                      {order.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">订单号：{order.id}</p>
                    <p className="mt-1 text-sm text-white/60">时间：{order.time}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="text-lg font-semibold text-green-400">
                      {order.price}
                    </span>
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-3">
          <Link href="/" className="text-sm text-white/70 hover:text-cyan-300">
            首页
          </Link>
          <Link href="/orders" className="text-sm text-cyan-300">
            我的订单
          </Link>
          <button
            onClick={() => alert("这里后面可以放个人中心")}
            className="text-sm text-white/70 hover:text-cyan-300"
          >
            个人中心
          </button>
        </div>
      </nav>
    </main>
  );
}