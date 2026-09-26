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
        className="mobile-header"
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button"
        >
          ☰
        </button>
        <span className="mobile-title">DApp 后台</span>
      </div>

      {/* 左侧菜单栏（电脑端固定显示，手机端默认隐藏） */}
      <aside
        className={`sidebar ${isMenuOpen ? 'open' : ''}`}
      >
        <h2 className="desktop-title">DApp 后台</h2>

        <nav className="nav-container">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="nav-item"
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
          className="mobile-overlay"
        />
      )}

      {/* 右侧主内容区域 */}
      <main
        className="main-content"
      >
        {children}
      </main>

      {/* 响应式样式控制 */}
      <style jsx global>{`
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #111833;
          border-bottom: 1px solid #22305f;
          z-index: 50;
          align-items: center;
          padding: 0 16px;
        }

        .menu-button {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-title {
          margin-left: 16px;
          font-size: 18px;
          font-weight: bold;
        }

        .sidebar {
          width: 240px;
          background: #111833;
          border-right: 1px solid #22305f;
          padding: 24px 16px;
          position: fixed;
          height: 100vh;
          overflowY: auto;
          z-index: 40;
          transition: transform 0.3s ease;
          transform: translateX(0);
        }

        .desktop-title {
          font-size: 22px;
          margin-bottom: 24px;
          display: block;
        }

        .nav-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-item {
          padding: 12px 14px;
          border-radius: 8px;
          background: #182347;
          color: #fff;
          text-decoration: none;
          display: block;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 30;
        }

        .main-content {
          flex: 1;
          padding: 24px;
          margin-left: 240px;
        }

        /* ========== 手机端响应式断点 ========== */
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