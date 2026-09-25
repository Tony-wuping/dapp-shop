import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 从环境变量中获取数据库连接配置，不要硬编码密码
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "dapp_mall",
  port: Number(process.env.DB_PORT) || 3306,
};

// GET 请求：获取所有设置
export async function GET() {
  let connection;
  try {
    // 动态创建连接，用完即毁，防止在 Serverless 环境下连接泄漏
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM settings");
    
    // 将数据库的 [{key:..., value:...}] 数组转换为 {key: value} 对象，方便前端使用
    const settings = (rows as Array<{ setting_key: string; setting_value: string }>).reduce(
      (acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      },
      {} as Record<string, string>
    );
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    // 如果数据库连接失败，返回一个友好的 JSON 提示，而不是让整个构建崩溃
    console.error("Database connection failed:", error.message);
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST 请求：保存设置（支持同时保存多个键值对）
export async function POST(req: Request) {
  let connection;
  try {
    const { settings } = await req.json();
    if (!settings) {
      return NextResponse.json({ success: false, error: "No settings provided" }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    // 遍历保存每一个键值对
    for (const [key, value] of Object.entries(settings)) {
      // 使用标准的 ExecuteValues 类型定义，消除 TS2769 类型报错
      const queryOptions = {
        sql: "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        values: [key, value, value] as mysql.ExecuteValues,
      };
      await connection.execute(queryOptions.sql, queryOptions.values);
    }
    
    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error: any) {
    console.error("Settings save failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}