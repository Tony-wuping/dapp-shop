"use client";

import { useState } from "react";

type PaymentItem = {
  coinType: "USDT";
  chainType: "TRC20" | "ERC20" | "BSC";
  receiveAddress: string;
  confirmCount: string;
  timeoutMinutes: string;
  callbackUrl: string;
  status: "启用" | "禁用";
};

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<PaymentItem[]>([
    {
      coinType: "USDT",
      chainType: "TRC20",
      receiveAddress: "Txxxxxxxxxxxxxxxxxxxxxxxxxx",
      confirmCount: "1",
      timeoutMinutes: "10",
      callbackUrl: "",
      status: "启用",
    },
    {
      coinType: "USDT",
      chainType: "ERC20",
      receiveAddress: "0xxxxxxxxxxxxxxxxxxxxxxxxxx",
      confirmCount: "1",
      timeoutMinutes: "10",
      callbackUrl: "",
      status: "启用",
    },
    {
      coinType: "USDT",
      chainType: "BSC",
      receiveAddress: "0xxxxxxxxxxxxxxxxxxxxxxxxxx",
      confirmCount: "1",
      timeoutMinutes: "10",
      callbackUrl: "",
      status: "启用",
    },
  ]);

  const handleChange = (
    index: number,
    field: keyof PaymentItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    console.log("收款设置：", items);
    alert("收款设置已保存（当前是页面演示，后面会接数据库）");
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>收款设置</h1>
        <p style={{ color: "#94a3b8" }}>
          这里配置 USDT 的 TRC20 / ERC20 / BSC 收款地址、确认数、超时时间和回调地址。
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {items.map((item, index) => (
          <div
            key={item.chainType}
            style={{
              background: "#111833",
              border: "1px solid #22305f",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
              {item.coinType} / {item.chainType}
            </h2>

            <div style={gridStyle}>
              <Field
                label="收款地址"
                value={item.receiveAddress}
                onChange={(v) => handleChange(index, "receiveAddress", v)}
              />
              <Field
                label="确认数"
                value={item.confirmCount}
                onChange={(v) => handleChange(index, "confirmCount", v)}
              />
              <Field
                label="超时时间（分钟）"
                value={item.timeoutMinutes}
                onChange={(v) => handleChange(index, "timeoutMinutes", v)}
              />
              <Field
                label="回调地址"
                value={item.callbackUrl}
                onChange={(v) => handleChange(index, "callbackUrl", v)}
              />

              <SelectField
                label="状态"
                value={item.status}
                onChange={(v) => handleChange(index, "status", v)}
                options={["启用", "禁用"]}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <button onClick={handleSave} style={saveBtnStyle}>
          保存收款设置
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        placeholder={`请输入${label}`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#c7d2fe",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
};

const saveBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};