import { NextResponse } from "next/server";
import { createConnection } from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "dapp_mall",
};

// GET 请求：获取所有设置
export async function GET() {
  let connection;
  try {
    connection = await createConnection(dbConfig);
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    connection = await createConnection(dbConfig);

    // 遍历保存每一个键值对
    for (const [key, value] of Object.entries(settings)) {
      await connection.execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        [key, value, value]
      );
    }
    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}