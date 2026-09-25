"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteTitle: "我的DApp商城",
    siteLogo: "",
    siteDesc: "基于区块链的钱包商城系统",
    email: "admin@example.com",
    phone: "13800000000",
    customerService: "Telegram / WhatsApp / 微信客服",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("系统设置：", form);
    alert("系统设置已保存（当前是演示页面，后面会接数据库）");
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>系统设置</h1>
        <p style={{ color: "#94a3b8" }}>
          这里配置网站标题、Logo、网站说明、联系邮箱、联系电话、客服方式。
        </p>
      </div>

      <div
        style={{
          background: "#111833",
          border: "1px solid #22305f",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "720px",
        }}
      >
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>网站标题</label>
          <input
            name="siteTitle"
            value={form.siteTitle}
            onChange={handleChange}
            style={inputStyle}
            placeholder="请输入网站标题"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>网站 Logo</label>
          <input
            name="siteLogo"
            value={form.siteLogo}
            onChange={handleChange}
            style={inputStyle}
            placeholder="请输入 Logo 图片地址"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>网站说明</label>
          <textarea
            name="siteDesc"
            value={form.siteDesc}
            onChange={handleChange}
            rows={4}
            style={textareaStyle}
            placeholder="请输入网站说明"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>联系邮箱</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="请输入联系邮箱"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>联系电话</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
            placeholder="请输入联系电话"
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>客服方式</label>
          <textarea
            name="customerService"
            value={form.customerService}
            onChange={handleChange}
            rows={4}
            style={textareaStyle}
            placeholder="请输入客服方式"
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <button onClick={handleSave} style={saveBtnStyle}>
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: "18px",
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
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const saveBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};