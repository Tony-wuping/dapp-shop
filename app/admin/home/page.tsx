"use client";

import { useState } from "react";

type BannerItem = {
  title: string;
  image: string;
  link: string;
};

export default function AdminHomePage() {
  const [notice, setNotice] = useState("欢迎来到 DApp 商城");
  const [activityEntry, setActivityEntry] = useState("活动入口");
  const [activityLink, setActivityLink] = useState("https://example.com");
  const [footerContent, setFooterContent] = useState("Copyright © 2025 DApp 商城");

  const [banners, setBanners] = useState<BannerItem[]>([
    {
      title: "Banner 1",
      image: "https://via.placeholder.com/800x300",
      link: "https://example.com/1",
    },
    {
      title: "Banner 2",
      image: "https://via.placeholder.com/800x300",
      link: "https://example.com/2",
    },
    {
      title: "Banner 3",
      image: "https://via.placeholder.com/800x300",
      link: "https://example.com/3",
    },
  ]);

  const [recommendedProducts, setRecommendedProducts] = useState("商品A, 商品B, 商品C");

  const handleBannerChange = (index: number, field: keyof BannerItem, value: string) => {
    setBanners((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addBanner = () => {
    setBanners((prev) => [
      ...prev,
      {
        title: `Banner ${prev.length + 1}`,
        image: "",
        link: "",
      },
    ]);
  };

  const removeBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const data = {
      banners,
      notice,
      recommendedProducts,
      activityEntry,
      activityLink,
      footerContent,
    };

    console.log("首页配置：", data);
    alert("首页配置已保存（当前是演示页面，后面会接数据库）");
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>首页配置</h1>
        <p style={{ color: "#94a3b8" }}>
          这里可以配置首页 Banner、公告、推荐商品、活动入口、页脚内容。
        </p>
      </div>

      {/* Banner */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>首页 Banner</h2>

        <div style={{ display: "grid", gap: "16px" }}>
          {banners.map((banner, index) => (
            <div key={index} style={bannerCardStyle}>
              <div style={bannerHeadStyle}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{banner.title}</h3>
                <button
                  type="button"
                  onClick={() => removeBanner(index)}
                  style={dangerBtnStyle}
                >
                  删除
                </button>
              </div>

              <div style={gridStyle}>
                <Field
                  label="标题"
                  value={banner.title}
                  onChange={(v) => handleBannerChange(index, "title", v)}
                />
                <Field
                  label="图片地址"
                  value={banner.image}
                  onChange={(v) => handleBannerChange(index, "image", v)}
                />
                <Field
                  label="跳转链接"
                  value={banner.link}
                  onChange={(v) => handleBannerChange(index, "link", v)}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="button" onClick={addBanner} style={secondaryBtnStyle}>
            + 添加 Banner
          </button>
        </div>
      </section>

      {/* 公告 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>公告</h2>
        <textarea
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          rows={4}
          placeholder="请输入首页公告"
          style={textareaStyle}
        />
      </section>

      {/* 推荐商品 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>推荐商品</h2>
        <p style={{ color: "#94a3b8", marginTop: 0 }}>
          这里先用逗号分隔商品名，后面接数据库后可以直接选商品。
        </p>
        <input
          value={recommendedProducts}
          onChange={(e) => setRecommendedProducts(e.target.value)}
          placeholder="商品A, 商品B, 商品C"
          style={inputStyle}
        />
      </section>

      {/* 活动入口 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>活动入口</h2>
        <div style={gridStyle}>
          <Field
            label="入口名称"
            value={activityEntry}
            onChange={setActivityEntry}
          />
          <Field
            label="入口链接"
            value={activityLink}
            onChange={setActivityLink}
          />
        </div>
      </section>

      {/* 页脚 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>页脚内容</h2>
        <textarea
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
          rows={4}
          placeholder="请输入页脚内容"
          style={textareaStyle}
        />
      </section>

      <div style={{ marginTop: "24px" }}>
        <button type="button" onClick={handleSave} style={saveBtnStyle}>
          保存首页配置
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

const sectionStyle: React.CSSProperties = {
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  marginBottom: "16px",
  marginTop: 0,
};

const bannerCardStyle: React.CSSProperties = {
  border: "1px solid #22305f",
  borderRadius: "10px",
  padding: "16px",
  background: "#0f172a",
};

const bannerHeadStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
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

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#475569",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const dangerBtnStyle: React.CSSProperties = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};