"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 当菜单打开时，禁止主页面（背景）滚动，防止“冻结”问题
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
    <div className="app-container">
      {/* 1. 手机端专属顶部导航栏（包含超大点击区域的汉堡按钮） */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span>☰</span>
        </button>
        <span className="mobile-title">DApp 后台</span>
      </div>

      {/* 2. 侧边菜单栏 */}
      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <h2 className="desktop-title">DApp 后台</h2>
          <nav className="nav-container">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* 3. 手机端遮罩层 */}
      {isMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 4. 主内容区域 */}
      <main className="main-content">
        {children}
      </main>

      {/* 移动端专属全局样式与适配方案 */}
      <style jsx global>{`
        /* 基础容器与防抖设置 */
        .app-container {
          display: flex;
          min-height: 100vh;
          background: #0b1020;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }

        /* ================= 汉堡菜单与顶部导航 ================= */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #111833;
          border-bottom: 1px solid #22305f;
          z-index: 50;
          align-items: center;
          padding: 0 20px;
        }
        .hamburger-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 32px;
          padding: 12px;
          margin: -12px; /* 扩大点击热区到 60px 左右，绝对好点 */
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        .hamburger-btn:active {
          background: rgba(255, 255, 255, 0.1);
        }
        .mobile-title {
          margin-left: 16px;
          font-size: 20px;
          font-weight: bold;
        }

        /* ================= 侧边栏与防冻结滚动 ================= */
        .sidebar {
          width: 240px;
          background: #111833;
          border-right: 1px solid #22305f;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 40;
          transition: transform 0.3s ease;
          transform: translateX(0);
        }
        .sidebar-inner {
          height: 100%;
          overflow-y: auto; /* 关键修复：允许菜单内容溢出时独立滚动 */
          padding: 24px 16px;
          scrollbar-width: thin;
          scrollbar-color: #1e293b #111833;
        }
        .desktop-title {
          font-size: 22px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1e293b;
        }
        .nav-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-item {
          padding: 12px 14px;
          border-radius: 8px;
          background: #182347;
          color: #fff;
          text-decoration: none;
          display: block;
          font-size: 15px;
          transition: all 0.2s;
        }
        .nav-item:hover, .nav-item:active {
          background: #2a3b64;
        }

        /* 手机端遮罩层 */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 35;
        }

        /* 主内容区域 */
        .main-content {
          flex: 1;
          padding: 24px;
          margin-left: 240px;
          transition: margin 0.3s ease;
          position: relative;
        }

        /* ================= 全局卡片化适配方案 (针对订单/用户页面) ================= */
        .data-card-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .data-card {
          background: #1e293b;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #334155;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .data-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-bottom: 1px solid #334155;
          padding-bottom: 8px;
        }
        .data-card-header h3 {
          font-size: 16px;
          color: #fff;
          margin: 0;
        }
        .data-card-header .status-badge {
          background: #1e3a8a;
          color: #60a5fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .data-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .data-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 14px;
        }
        .data-label {
          color: #94a3b8;
        }
        .data-value {
          color: #f8fafc;
          text-align: right;
          word-break: break-all;
          max-width: 60%;
        }
        .data-card-actions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #334155;
          display: flex;
          gap: 12px;
        }
        .card-action-btn {
          background: #3b82f6;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        /* ================= 手机端响应式断点 ================= */
        @media (max-width: 768px) {
          .mobile-header {
            display: flex !important;
          }
          .desktop-title {
            display: none !important;
          }
          .sidebar {
            transform: translateX(-100%);
            width: 280px; /* 手机端菜单稍微加宽一点更好操作 */
          }
          .sidebar.open {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 16px !important;
            padding-top: 80px !important; /* 留出顶部导航栏空间 */
          }
          .data-card-container {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}