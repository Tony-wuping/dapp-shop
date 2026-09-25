import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      }}
    >
      <aside
        style={{
          width: "240px",
          background: "#111833",
          borderRight: "1px solid #22305f",
          padding: "24px 16px",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>DApp 后台</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: "#182347",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "24px" }}>{children}</main>
    </div>
  );
}