"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menu = [
    { name: "仪表盘", href: "/admin" },
    { name: "商品管理", href: "/admin/products" },
    { name: "订单管理", href: "/admin/orders" },
    { name: "用户管理", href: "/admin/users" },
    { name: "收款设置", href: "/admin/payments" },
    { name: "首页配置", href: "/admin/home" },
    { name: "系统设置", href: "/admin/settings" },
    { name: "推荐设置", href: "/admin/referral" },
    { name: "风控设置", href: "/admin/risk" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b1020",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* 手机端顶部导航栏（汉堡菜单按钮） */}
      <div
        style={{
          display: "none", // 电脑端默认隐藏
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "#111833",
          borderBottom: "1px solid #22305f",
          zIndex: 50,
          alignItems: "center",
          padding: "0 16px",
        }}
        className="mobile-header" // 稍后通过CSS媒体查询控制显示
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          ☰
        </button>
        <span style={{ marginLeft: "16px", fontSize: "18px", fontWeight: "bold" }}>
          DApp 后台
        </span>
      </div>

      {/* 左侧菜单栏（电脑端固定显示，手机端默认隐藏） */}
      <aside
        style={{
          width: "240px",
          background: "#111833",
          borderRight: "1px solid #22305f",
          padding: "24px 16px",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          zIndex: 40,
          transition: "transform 0.3s ease",
        }}
        className="sidebar"
      >
        <h2
          style={{ fontSize: "22px", marginBottom: "24px" }}
          className="desktop-title"
        >
          DApp 后台
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)} // 手机端点击菜单项后自动收起
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: "#182347",
                color: "#fff",
                textDecoration: "none",
                display: "block",
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 手机端菜单打开时的半透明遮罩层 */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 30,
          }}
          className="mobile-overlay"
        />
      )}

      {/* 右侧主内容区域 */}
      <main
        style={{
          flex: 1,
          padding: "24px",
          marginLeft: "240px", // 电脑端留出左侧菜单的宽度
        }}
        className="main-content"
      >
        {children}
      </main>

      {/* 响应式样式：控制手机端和电脑端的显示切换 */}
      <style jsx global>{`
        .mobile-header {
          display: none;
        }
        .desktop-title {
          display: block;
        }
        .sidebar {
          transform: translateX(0);
        }
        .main-content {
          margin-left: 240px;
          padding-top: 24px;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex !important;
          }
          .desktop-title {
            display: none !important;
          }
          .sidebar {
            transform: translateX(-100%);
            width: 260px;
          }
          .sidebar.open {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}