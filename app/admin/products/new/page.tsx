"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    intro: "",
    detail: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    status: "上架",
    isRecommended: "否",
    sortOrder: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 这里先不接数据库，先看表单是否能提交成功
    console.log("商品表单数据：", form);
    alert("商品已保存（当前只是演示，后面会接数据库）");
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "28px", margin: 0 }}>新增商品</h1>
        <Link href="/admin/products" style={backBtnStyle}>
          返回商品列表
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={gridStyle}>
          <Field label="商品名称" name="name" value={form.name} onChange={handleChange} />
          <Field label="商品简介" name="intro" value={form.intro} onChange={handleChange} />
          <Field label="商品价格（USDT）" name="price" value={form.price} onChange={handleChange} />
          <Field label="商品图片地址" name="image" value={form.image} onChange={handleChange} />
          <Field label="商品分类" name="category" value={form.category} onChange={handleChange} />
          <Field label="库存数量" name="stock" value={form.stock} onChange={handleChange} />
          <Field label="排序号" name="sortOrder" value={form.sortOrder} onChange={handleChange} />

          <SelectField
            label="商品状态"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["上架", "下架"]}
          />

          <SelectField
            label="是否推荐"
            name="isRecommended"
            value={form.isRecommended}
            onChange={handleChange}
            options={["是", "否"]}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={labelStyle}>商品详情</label>
          <textarea
            name="detail"
            value={form.detail}
            onChange={handleChange}
            placeholder="请输入商品详情..."
            rows={8}
            style={textareaStyle}
          />
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button type="submit" style={saveBtnStyle}>
            保存商品
          </button>
          <Link href="/admin/products" style={cancelBtnStyle}>
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`请输入${label}`}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={value} onChange={onChange} style={inputStyle}>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  color: "#fff",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const backBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#334155",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "8px",
};

const formStyle: React.CSSProperties = {
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "12px",
  padding: "20px",
};

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

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  resize: "vertical",
};

const saveBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#475569",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "8px",
};