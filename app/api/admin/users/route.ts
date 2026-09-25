import { NextResponse } from "next/server";
import { createConnection } from "mysql2/promise";

// 数据库连接配置
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "dapp_mall",
};

export async function GET() {
  let connection;
  try {
    // 建立连接
    connection = await createConnection(dbConfig);
    
    // 查询用户表数据，按 ID 倒序排列
    const [rows] = await connection.execute("SELECT * FROM users ORDER BY id DESC");
    
    // 返回 JSON 数据给前端页面
    return NextResponse.json({ success: true, data: rows });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    // 用完关闭连接
    if (connection) await connection.end();
  }
}