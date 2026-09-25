export default function AdminHomePage() {
  const cards = [
    { title: "今日订单数", value: "12" },
    { title: "今日收入总额", value: "1280 USDT" },
    { title: "总用户数", value: "358" },
    { title: "上架商品数", value: "24" },
    { title: "待支付订单数", value: "5" },
    { title: "推荐注册数", value: "46" },
  ];

  return (
    <main style={{ padding: "24px", color: "#fff", background: "#0b1020", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>DApp 后台仪表盘</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {cards.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#111833",
              border: "1px solid #22305f",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#9fb3ff" }}>{item.title}</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "10px" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}