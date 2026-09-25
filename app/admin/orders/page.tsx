"use client";

import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  orderNo: string;
  userId: string;
  walletAddress: string;
  nickname: string;
  productId: string;
  productName: string;
  productPrice: string;
  coinType: string;
  chainType: string;
  payAddress: string;
  orderStatus: string;
  createdAt: string;
  paidAt: string;
  completedAt: string;
  timeoutAt: string;
  shippingInfo: string;
  remark: string;
};

type EditForm = {
  orderStatus: string;
  shippingInfo: string;
  remark: string;
  payAddress: string;
  chainType: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    orderStatus: "pending",
    shippingInfo: "",
    remark: "",
    payAddress: "",
    chainType: "TRC20",
  });

  const loadOrders = async (keyword = "", statusFilter = "all") => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/admin/orders?query=${encodeURIComponent(keyword)}&status=${encodeURIComponent(statusFilter)}`
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "加载订单失败");
      }

      setOrders(data.data || []);
    } catch (err: any) {
      setError(err.message || "加载订单失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.orderStatus === "pending").length,
      paid: orders.filter((o) => o.orderStatus === "paid").length,
      completed: orders.filter((o) => o.orderStatus === "completed").length,
      expired: orders.filter((o) => o.orderStatus === "expired").length,
    };
  }, [orders]);

  const handleSearch = () => {
    loadOrders(query.trim(), status);
  };

  const handleReset = () => {
    setQuery("");
    setStatus("all");
    loadOrders("", "all");
  };

  const updateOrder = async (id: string, payload: any) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "操作失败");
    }

    return data.data as OrderItem;
  };

  const openEdit = (order: OrderItem) => {
    setEditingOrder(order);
    setEditForm({
      orderStatus: order.orderStatus,
      shippingInfo: order.shippingInfo || "",
      remark: order.remark || "",
      payAddress: order.payAddress || "",
      chainType: order.chainType || "TRC20",
    });
  };

  const openView = (order: OrderItem) => {
    setViewingOrder(order);
  };

  const saveEdit = async () => {
    if (!editingOrder) return;

    try {
      const updated = await updateOrder(editingOrder.id, {
        orderStatus: editForm.orderStatus,
        shippingInfo: editForm.shippingInfo,
        remark: editForm.remark,
        payAddress: editForm.payAddress,
        chainType: editForm.chainType,
      });

      setOrders((prev) =>
        prev.map((item) => (item.id === editingOrder.id ? updated : item))
      );

      setEditingOrder(null);
      alert("订单已更新");
    } catch (err: any) {
      alert(err.message || "更新失败");
    }
  };

  const markPaid = async (order: OrderItem) => {
    try {
      const updated = await updateOrder(order.id, {
        orderStatus: "paid",
        paidAt: new Date().toISOString(),
      });

      setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)));
      alert("已标记为已支付");
    } catch (err: any) {
      alert(err.message || "操作失败");
    }
  };

  const markCompleted = async (order: OrderItem) => {
    try {
      const updated = await updateOrder(order.id, {
        orderStatus: "completed",
        completedAt: new Date().toISOString(),
      });

      setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)));
      alert("已标记为已完成");
    } catch (err: any) {
      alert(err.message || "操作失败");
    }
  };

  const markExpired = async (order: OrderItem) => {
    if (!window.confirm("确定要把这个订单标记为已超时吗？")) return;

    try {
      const updated = await updateOrder(order.id, {
        orderStatus: "expired",
      });

      setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)));
      alert("已标记为已超时");
    } catch (err: any) {
      alert(err.message || "操作失败");
    }
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>订单管理</h1>
        <p style={{ color: "#94a3b8" }}>
          这里可以查看订单、搜索订单、修改状态、查看付款地址、标记已支付或已完成。
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={statsGrid}>
        <StatCard title="订单总数" value={stats.total} />
        <StatCard title="待支付" value={stats.pending} />
        <StatCard title="已支付" value={stats.paid} />
        <StatCard title="已完成" value={stats.completed} />
        <StatCard title="已超时" value={stats.expired} />
      </div>

      {/* 搜索栏 */}
      <div style={searchBar}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索订单号 / 钱包地址 / 昵称 / 商品名 / 收款地址"
          style={searchInputStyle}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="all">全部状态</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="completed">已完成</option>
          <option value="expired">已超时</option>
          <option value="cancelled">已取消</option>
        </select>

        <button onClick={handleSearch} style={primaryBtnStyle}>
          搜索
        </button>
        <button onClick={handleReset} style={secondaryBtnStyle}>
          重置
        </button>
      </div>

      {/* 错误提示 */}
      {error ? <div style={errorBoxStyle}>{error}</div> : null}

      {/* 订单表格 */}
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead style={{ background: "#182347" }}>
            <tr>
              <th style={thStyle}>订单号</th>
              <th style={thStyle}>钱包地址</th>
              <th style={thStyle}>用户昵称</th>
              <th style={thStyle}>商品名称</th>
              <th style={thStyle}>价格</th>
              <th style={thStyle}>币种</th>
              <th style={thStyle}>链</th>
              <th style={thStyle}>状态</th>
              <th style={thStyle}>创建时间</th>
              <th style={thStyle}>支付时间</th>
              <th style={thStyle}>完成时间</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={tdStyle} colSpan={12}>
                  加载中...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan={12}>
                  暂无订单数据
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={trStyle}>
                  <td style={tdStyle}>{order.orderNo}</td>
                  <td style={tdStyle}>{order.walletAddress}</td>
                  <td style={tdStyle}>{order.nickname || "-"}</td>
                  <td style={tdStyle}>{order.productName}</td>
                  <td style={tdStyle}>{order.productPrice} USDT</td>
                  <td style={tdStyle}>{order.coinType}</td>
                  <td style={tdStyle}>{order.chainType}</td>
                  <td style={tdStyle}>
                    <span style={{ ...statusTagStyle, background: getStatusColor(order.orderStatus) }}>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(order.createdAt)}</td>
                  <td style={tdStyle}>{formatDate(order.paidAt)}</td>
                  <td style={tdStyle}>{formatDate(order.completedAt)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button style={actionBtnStyle} onClick={() => openView(order)}>
                        查看
                      </button>
                      <button style={actionBtnStyle} onClick={() => openEdit(order)}>
                        编辑
                      </button>
                      <button
                        style={{ ...actionBtnStyle, background: "#16a34a" }}
                        onClick={() => markPaid(order)}
                      >
                        标记已支付
                      </button>
                      <button
                        style={{ ...actionBtnStyle, background: "#1d4ed8" }}
                        onClick={() => markCompleted(order)}
                      >
                        标记已完成
                      </button>
                      <button
                        style={{ ...actionBtnStyle, background: "#dc2626" }}
                        onClick={() => markExpired(order)}
                      >
                        标记已超时
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 详情弹窗 */}
      {viewingOrder ? (
        <Modal title="订单详情" onClose={() => setViewingOrder(null)}>
          <DetailList
            items={[
              ["订单号", viewingOrder.orderNo],
              ["钱包地址", viewingOrder.walletAddress],
              ["用户昵称", viewingOrder.nickname || "-"],
              ["商品名称", viewingOrder.productName],
              ["商品价格", `${viewingOrder.productPrice} USDT`],
              ["支付币种", viewingOrder.coinType],
              ["支付链", viewingOrder.chainType],
              ["收款地址", viewingOrder.payAddress],
              ["订单状态", getStatusLabel(viewingOrder.orderStatus)],
              ["创建时间", formatDate(viewingOrder.createdAt)],
              ["支付时间", formatDate(viewingOrder.paidAt)],
              ["完成时间", formatDate(viewingOrder.completedAt)],
              ["超时时间", formatDate(viewingOrder.timeoutAt)],
              ["收货人地址联系信息", viewingOrder.shippingInfo || "-"],
              ["备注", viewingOrder.remark || "-"],
            ]}
          />
        </Modal>
      ) : null}

      {/* 编辑弹窗 */}
      {editingOrder ? (
        <Modal title="编辑订单" onClose={() => setEditingOrder(null)}>
          <FormGrid>
            <Field
              label="订单状态"
              value={editForm.orderStatus}
              onChange={(v) => setEditForm((p) => ({ ...p, orderStatus: v }))}
              as="select"
              options={[
                ["pending", "待支付"],
                ["paid", "已支付"],
                ["completed", "已完成"],
                ["expired", "已超时"],
                ["cancelled", "已取消"],
              ]}
            />
            <Field
              label="支付链"
              value={editForm.chainType}
              onChange={(v) => setEditForm((p) => ({ ...p, chainType: v }))}
            />
            <Field
              label="收款地址"
              value={editForm.payAddress}
              onChange={(v) => setEditForm((p) => ({ ...p, payAddress: v }))}
            />
            <TextAreaField
              label="收货人地址联系信息"
              value={editForm.shippingInfo}
              onChange={(v) => setEditForm((p) => ({ ...p, shippingInfo: v }))}
            />
            <TextAreaField
              label="备注"
              value={editForm.remark}
              onChange={(v) => setEditForm((p) => ({ ...p, remark: v }))}
            />
          </FormGrid>

          <div style={modalBtnRowStyle}>
            <button onClick={saveEdit} style={primaryBtnStyle}>
              保存
            </button>
            <button
              onClick={() => setEditingOrder(null)}
              style={secondaryBtnStyle}
            >
              取消
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: "#94a3b8", fontSize: "14px" }}>{title}</div>
      <div style={{ marginTop: "10px", fontSize: "28px", fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>{title}</h2>
          <button onClick={onClose} style={closeBtnStyle}>
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={formGridStyle}>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  as = "input",
  options = [],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  as?: "input" | "select";
  options?: Array<[string, string]>;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {as === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        >
          {options.map(([val, text]) => (
            <option key={val} value={val}>
              {text}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={textAreaStyle}
      />
    </div>
  );
}

function DetailList({ items }: { items: Array<[string, string]> }) {
  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {items.map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: "12px",
            padding: "10px 12px",
            background: "#0f172a",
            border: "1px solid #22305f",
            borderRadius: "8px",
          }}
        >
          <div style={{ color: "#94a3b8" }}>{k}</div>
          <div style={{ color: "#fff", wordBreak: "break-all" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    completed: "已完成",
    expired: "已超时",
    cancelled: "已取消",
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: "#f59e0b",
    paid: "#16a34a",
    completed: "#2563eb",
    expired: "#dc2626",
    cancelled: "#64748b",
  };
  return map[status] || "#334155";
}

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const statCardStyle: React.CSSProperties = {
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "12px",
  padding: "18px",
};

const searchBar: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const searchInputStyle: React.CSSProperties = {
  flex: "1 1 320px",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  // 修正: 已删除此处错误拼写的 boxXsizing
};

const selectStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#475569",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const errorBoxStyle: React.CSSProperties = {
  marginBottom: "16px",
  padding: "12px 14px",
  borderRadius: "8px",
  background: "#7f1d1d",
  color: "#fecaca",
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto",
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "12px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1700px",
};

const thStyle: React.CSSProperties = {
  padding: "14px",
  textAlign: "left",
  color: "#c7d2fe",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "14px",
  color: "#fff",
  borderTop: "1px solid #22305f",
  verticalAlign: "top",
};

const trStyle: React.CSSProperties = {
  borderTop: "1px solid #22305f",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "8px 12px",
  background: "#334155",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const statusTagStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  color: "#fff",
  fontSize: "12px",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "900px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "14px",
  padding: "20px",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "18px",
};

const closeBtnStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  border: "none",
  background: "#334155",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
  lineHeight: 1,
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#c7d2fe",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box", // 修正: 已删除此处错误拼写的 boxXsizing
};

const textAreaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box", // 修正: 已删除此处错误拼写的 boxXsizing
  resize: "vertical",
};

const modalBtnRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
  marginTop: "20px",
  flexWrap: "wrap",
};