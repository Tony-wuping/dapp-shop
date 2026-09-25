import { NextResponse } from "next/server";
import { createConnection } from "mysql2/promise";

// 创建数据库连接配置（直接连接你的 MySQL）
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "dapp_mall",
};

export async function GET() {
  let connection;
  try {
    // 1. 建立连接
    connection = await createConnection(dbConfig);
    
    // 2. 执行 SQL 查询，从 products 表里拿数据
    const [rows] = await connection.execute("SELECT * FROM products ORDER BY id DESC");
    
    // 3. 返回 JSON 数据给前端页面
    return NextResponse.json({ success: true, data: rows });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    // 4. 用完关闭连接，释放资源
    if (connection) await connection.end();
  }
}