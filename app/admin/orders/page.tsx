'use client';

import React, { useEffect, useMemo, useState } from 'react';

type OrderStatus = 'pending' | 'paid' | 'completed' | 'expired' | string;

type OrderItem = {
  id: string | number;
  orderNo?: string;
  orderNumber?: string;
  walletAddress?: string;
  nickname?: string;
  userNickname?: string;
  productName?: string;
  productTitle?: string;
  price?: number | string;
  amount?: number | string;
  chain?: string;
  network?: string;
  status?: OrderStatus;
  orderStatus?: OrderStatus;
  createdAt?: string;
  paidAt?: string;
  completedAt?: string;
  receivingAddress?: string;
  deliveryAddress?: string;
  shippingAddress?: string;
  address?: string;
  shippingNo?: string;
  expressNo?: string;
  trackingNo?: string;
  logisticsNo?: string;
  courierNo?: string;
  paymentAddress?: string;
  txHash?: string;
  hash?: string;
};

type ApiListResponse =
  | {
      success?: boolean;
      data?: OrderItem[];
      orders?: OrderItem[];
      message?: string;
      error?: string;
    }
  | OrderItem[];

function safeString(v: unknown) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function formatDate(value?: string) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatMoney(value?: number | string) {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString('zh-CN', { maximumFractionDigits: 8 });
}

function normalizeStatus(raw?: string) {
  const s = (raw || '').toLowerCase();
  if (s.includes('pending') || s.includes('unpaid') || s.includes('待')) return 'pending';
  if (s.includes('paid') || s.includes('已付')) return 'paid';
  if (s.includes('completed') || s.includes('done') || s.includes('完成')) return 'completed';
  if (s.includes('expired') || s.includes('timeout') || s.includes('超时')) return 'expired';
  return raw || 'unknown';
}

function statusText(status?: string) {
  switch (normalizeStatus(status)) {
    case 'pending':
      return '待支付';
    case 'paid':
      return '已支付';
    case 'completed':
      return '已完成';
    case 'expired':
      return '已超时';
    default:
      return status || '未知';
  }
}

function statusClass(status?: string) {
  switch (normalizeStatus(status)) {
    case 'pending':
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/20';
    case 'paid':
      return 'bg-blue-500/15 text-blue-300 border border-blue-500/20';
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20';
    case 'expired':
      return 'bg-rose-500/15 text-rose-300 border border-rose-500/20';
    default:
      return 'bg-slate-500/15 text-slate-300 border border-slate-500/20';
  }
}

function getReceivingAddress(item: OrderItem) {
  return (
    item.receivingAddress ||
    item.deliveryAddress ||
    item.shippingAddress ||
    item.address ||
    '-'
  );
}

function getShippingNo(item: OrderItem) {
  return (
    item.shippingNo ||
    item.expressNo ||
    item.trackingNo ||
    item.logisticsNo ||
    item.courierNo ||
    ''
  );
}

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();

  let parsed: any = null;
  if (raw) {
    if (contentType.includes('application/json')) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error(`接口返回的 JSON 无法解析：${raw.slice(0, 120)}`);
      }
    } else {
      throw new Error(`接口未返回 JSON：${raw.slice(0, 120)}`);
    }
  }

  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `请求失败（${res.status}）`;
    throw new Error(msg);
  }

  return parsed as ApiListResponse;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [shippingInputs, setShippingInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setPageError('');

    try {
      const data = await fetchJson('/api/admin/orders');

      let list: OrderItem[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data?.data && Array.isArray(data.data)) {
        list = data.data;
      } else if (data?.orders && Array.isArray(data.orders)) {
        list = data.orders;
      }

      setOrders(list);
    } catch (err: any) {
      setPageError(err?.message || '加载订单失败');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((item) => {
      const itemStatus = normalizeStatus(item.status ?? item.orderStatus);
      const matchStatus = statusFilter === 'all' || itemStatus === statusFilter;

      if (!keyword) return matchStatus;

      const fields = [
        item.orderNo,
        item.orderNumber,
        item.walletAddress,
        item.nickname,
        item.userNickname,
        item.productName,
        item.productTitle,
        item.receivingAddress,
        item.deliveryAddress,
        item.shippingAddress,
        item.address,
        item.shippingNo,
        item.expressNo,
        item.trackingNo,
        item.logisticsNo,
        item.courierNo,
        item.paymentAddress,
        item.txHash,
        item.hash,
        item.chain,
        item.network,
        item.status,
        item.orderStatus,
      ]
        .map(safeString)
        .join(' ')
        .toLowerCase();

      return matchStatus && fields.includes(keyword);
    });
  }, [orders, search, statusFilter]);

  const displayOrders: OrderItem[] = useMemo(() => {
    if (loading) return [];
    if (filteredOrders.length > 0) return filteredOrders;

    // 演示订单案例：当真实数据为空时显示，方便你看效果
    return [
      {
        id: 'demo-001',
        orderNo: 'DEMO-20260926-0001',
        walletAddress: '0x8a3f...c91d',
        nickname: 'Tony',
        productName: '示例商品 / Demo Product',
        price: 99.99,
        chain: 'BSC',
        status: 'paid',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        receivingAddress: '上海市浦东新区世纪大道 88 号 12 楼 Tony 收',
        shippingNo: '',
      },
    ];
  }, [filteredOrders, loading]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => normalizeStatus(o.status ?? o.orderStatus) === 'pending').length;
    const paid = orders.filter((o) => normalizeStatus(o.status ?? o.orderStatus) === 'paid').length;
    const completed = orders.filter((o) => normalizeStatus(o.status ?? o.orderStatus) === 'completed').length;
    const expired = orders.filter((o) => normalizeStatus(o.status ?? o.orderStatus) === 'expired').length;

    return { total, pending, paid, completed, expired };
  }, [orders]);

  const copyReceivingAddress = async (id: string | number, address: string) => {
    if (!address || address === '-') return;

    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1200);
    } catch {
      setPageError('复制失败，请检查浏览器权限');
    }
  };

  const updateShippingNo = async (id: string | number) => {
    const key = String(id);
    const shippingNo = (shippingInputs[key] ?? '').trim();

    if (!shippingNo) {
      return;
    }

    setUpdatingId(id);
    setPageError('');

    try {
      const result = await fetchJson(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          shippingNo,
          // 如果你希望点击“已发货”时顺便改状态，可以保留这一行
          // orderStatus: 'completed',
        }),
      });

      if ((result as any)?.success === false) {
        throw new Error((result as any)?.message || (result as any)?.error || '保存失败');
      }

      setShippingInputs((prev) => ({
        ...prev,
        [key]: '',
      }));

      await loadOrders();
    } catch (err: any) {
      setPageError(err?.message || '保存快递单号失败');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1f] text-white">
      <main className="p-6">
        <div className="max-w-[1600px]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">订单管理</h1>
            <p className="mt-2 text-sm text-white/70">
              这里可以查看订单、搜索订单、修改状态、查看收货地址、填写快递单号。
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mb-5">
            {[
              { label: '订单总数', value: stats.total },
              { label: '待支付', value: stats.pending },
              { label: '已支付', value: stats.paid },
              { label: '已完成', value: stats.completed },
              { label: '已超时', value: stats.expired },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-blue-500/20 bg-[#10183a] p-5">
                <div className="text-sm text-white/70">{card.label}</div>
                <div className="mt-4 text-3xl font-semibold">{card.value}</div>
              </div>
            ))}
          </div>

          {/* 搜索区 */}
          <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d1431] p-3 md:flex-row md:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索订单号 / 钱包地址 / 昵称 / 商品名 / 收货地址 / 快递单号"
              className="h-11 flex-1 rounded-lg border border-white/10 bg-[#11193d] px-4 text-sm outline-none placeholder:text-white/35 focus:border-blue-500/60"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#11193d] px-4 text-sm outline-none md:w-40"
            >
              <option value="all">全部状态</option>
              <option value="pending">待支付</option>
              <option value="paid">已支付</option>
              <option value="completed">已完成</option>
              <option value="expired">已超时</option>
            </select>

            <button
              onClick={loadOrders}
              className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-medium hover:bg-blue-500"
            >
              搜索
            </button>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                loadOrders();
              }}
              className="h-11 rounded-lg bg-slate-600 px-5 text-sm font-medium hover:bg-slate-500"
            >
              重置
            </button>
          </div>

          {/* 错误提示 */}
          {pageError && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/80 px-4 py-3 text-sm text-red-100">
              {pageError}
            </div>
          )}

          {/* 表格 */}
          <div className="mt-4 overflow-hidden rounded-xl border border-blue-500/20 bg-[#0d1431]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-white/80">
                  <tr>
                    <th className="px-4 py-4 font-medium">订单号</th>
                    <th className="px-4 py-4 font-medium">钱包地址</th>
                    <th className="px-4 py-4 font-medium">用户昵称</th>
                    <th className="px-4 py-4 font-medium">商品名称</th>
                    <th className="px-4 py-4 font-medium">价格</th>
                    <th className="px-4 py-4 font-medium">链</th>
                    <th className="px-4 py-4 font-medium">状态</th>
                    <th className="px-4 py-4 font-medium">创建时间</th>
                    <th className="px-4 py-4 font-medium">支付时间</th>
                    <th className="px-4 py-4 font-medium">收货地址</th>
                    <th className="px-4 py-4 font-medium">快递单号</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-8 text-white/60" colSpan={11}>
                        正在加载订单...
                      </td>
                    </tr>
                  ) : displayOrders.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-white/60" colSpan={11}>
                        暂无订单数据
                      </td>
                    </tr>
                  ) : (
                    displayOrders.map((item) => {
                      const id = item.id;
                      const key = String(id);
                      const status = normalizeStatus(item.status ?? item.orderStatus);
                      const orderNo = item.orderNo || item.orderNumber || '-';
                      const wallet = item.walletAddress || '-';
                      const nickname = item.nickname || item.userNickname || '-';
                      const product = item.productName || item.productTitle || '-';
                      const price = formatMoney(item.price ?? item.amount);
                      const chain = item.chain || item.network || '-';
                      const createdAt = formatDate(item.createdAt);
                      const paidAt = formatDate(item.paidAt);
                      const receivingAddress = getReceivingAddress(item);
                      const shippingNo = getShippingNo(item);
                      const currentInput = shippingInputs[key] ?? '';

                      const canShip = currentInput.trim().length > 0;

                      return (
                        <tr key={key} className="border-b border-white/5 hover:bg-white/3 align-top">
                          <td className="px-4 py-4 whitespace-nowrap">{orderNo}</td>
                          <td className="px-4 py-4 whitespace-nowrap max-w-[220px] truncate">{wallet}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{nickname}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{product}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{price}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{chain}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>
                              {statusText(status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">{createdAt}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{paidAt}</td>

                          <td className="px-4 py-4 whitespace-nowrap max-w-[320px]">
                            <div className="flex items-start gap-2">
                              <span className="block break-all leading-6">{receivingAddress}</span>
                              <button
                                onClick={() => copyReceivingAddress(id, receivingAddress)}
                                disabled={!receivingAddress || receivingAddress === '-'}
                                className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {copiedId === id ? '已复制' : '复制'}
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap min-w-[300px]">
                            <div className="flex items-center gap-2">
                              <input
                                value={currentInput}
                                onChange={(e) =>
                                  setShippingInputs((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                placeholder="输入快递单号"
                                className="h-10 w-full rounded-lg border border-white/10 bg-[#11193d] px-3 text-sm outline-none placeholder:text-white/35 focus:border-blue-500/60"
                              />
                              <button
                                disabled={!canShip || updatingId === id}
                                onClick={() => updateShippingNo(id)}
                                className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium transition
                                  ${
                                    canShip && updatingId !== id
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                      : 'bg-slate-600 text-white/50 cursor-not-allowed'
                                  }`}
                              >
                                {updatingId === id ? '保存中...' : '已发货'}
                              </button>
                            </div>

                            <div className="mt-2 text-xs text-white/45">
                              当前单号：{shippingNo || '未填写'}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}