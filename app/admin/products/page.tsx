"use client";
import { useEffect, useState } from "react";

// 定义商品的类型
interface Product {
  id: number;
  product_name: string;
  price: string; // 数据库里的 decimal 会被当做字符串传过来
  stock: number;
  status: string;
}

const thStyle: React.CSSProperties = { padding: "14px", textAlign: "left", color: "#c7d2fe", fontWeight: "bold" };
const tdStyle: React.CSSProperties = { padding: "14px", color: "#fff" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 页面加载时，自动去调用后端 API 获取数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("获取商品失败", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ color: "#fff" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>商品管理</h1>

      {loading ? (
        <div style={{ padding: "20px", color: "#c7d2fe" }}>正在从数据库加载商品...</div>
      ) : (
        <div
          style={{
            background: "#111833",
            border: "1px solid #22305f",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#182347" }}>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>商品名称</th>
                <th style={thStyle}>价格</th>
                <th style={thStyle}>库存</th>
                <th style={thStyle}>状态</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                 <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center" }}>暂无商品</td></tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} style={{ borderTop: "1px solid #22305f" }}>
                    <td style={tdStyle}>{item.id}</td>
                    <td style={tdStyle}>{item.product_name}</td>
                    <td style={tdStyle}>{item.price}</td>
                    <td style={tdStyle}>{item.stock}</td>
                    <td style={tdStyle}>{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}