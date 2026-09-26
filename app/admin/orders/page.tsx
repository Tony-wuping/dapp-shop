"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // 获取订单数据（保留原逻辑）
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&pageSize=${pageSize}&search=${search}&status=${statusFilter}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("获取订单失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  // 处理状态变更
  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(); // 刷新列表
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">订单管理</h1>

      {/* 搜索与筛选区域（手机端自动换行） */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索订单号/商品名..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] p-3 rounded bg-[#1e293b] text-white border border-[#334155]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 rounded bg-[#1e293b] text-white border border-[#334155]"
        >
          <option value="all">全部状态</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      {/* 加载状态 */}
      {loading && <div className="text-center py-10 text-gray-400">加载中...</div>}

      {/* 无数据提示 */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-10 text-gray-400">暂无订单数据</div>
      )}

      {/* ✅ 核心修改：PC端显示表格，手机端显示卡片列表 */}
      {!loading && orders.length > 0 && (
        <>
          {/* --- PC端表格视图 (屏幕宽度大于768px时显示) --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e293b] text-gray-400 text-sm">
                  <th className="p-4 rounded-tl-lg">订单号</th>
                  <th className="p-4">商品</th>
                  <th className="p-4">用户</th>
                  <th className="p-4">金额</th>
                  <th className="p-4">状态</th>
                  <th className="p-4">时间</th>
                  <th className="p-4 rounded-tr-lg">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#334155] hover:bg-[#1e293b]/50">
                    <td className="p-4 font-mono text-sm">{order.orderNo}</td>
                    <td className="p-4">{order.productName}</td>
                    <td className="p-4">
                      <div className="text-sm">{order.nickname}</div>
                      <div className="text-xs text-gray-500 font-mono">{order.walletAddress?.slice(0, 6)}...{order.walletAddress?.slice(-4)}</div>
                    </td>
                    <td className="p-4 font-bold text-blue-400">{order.price} {order.chain}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#0f172a] border border-[#334155] rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">待支付</option>
                        <option value="paid">已支付</option>
                        <option value="shipped">已发货</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-400 hover:underline text-sm">
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- 手机端卡片视图 (屏幕宽度小于768px时显示) --- */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#334155]">
                  <div>
                    <div className="text-xs text-gray-400">订单号</div>
                    <div className="font-mono text-sm">{order.orderNo}</div>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-[#0f172a] border border-[#334155] rounded px-2 py-1 text-xs"
                  >
                    <option value="pending">待支付</option>
                    <option value="paid">已支付</option>
                    <option value="shipped">已发货</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">商品名称</span>
                    <span className="text-right max-w-[60%]">{order.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">支付金额</span>
                    <span className="font-bold text-blue-400">{order.price} {order.chain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">下单用户</span>
                    <span className="text-right max-w-[60%]">
                      {order.nickname} <br/>
                      <span className="text-xs opacity-50 font-mono">{order.walletAddress?.slice(0, 6)}...{order.walletAddress?.slice(-4)}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">下单时间</span>
                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#334155] flex justify-end">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-400 text-sm font-medium">
                    查看详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 分页控件（手机端自动换行居中） */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-[#1e293b] disabled:opacity-50"
        >
          上一页
        </button>
        <span className="text-gray-400">
          第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(total / pageSize)}
          className="px-4 py-2 rounded bg-[#1e293b] disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}