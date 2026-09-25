import { NextResponse } from 'next/server';
import { createConnection } from "mysql2/promise";

// 数据库连接配置 (建议改为环境变量，这里为了方便先保持)
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "dapp_mall",
  port: Number(process.env.DB_PORT) || 3306,
};

// PATCH 请求：更新单个订单状态
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // 核心修复：Next.js 15 必须 await 解包 params
  const { id } = await params;
  
  let connection;
  try {
    const payload = await req.json();
    connection = await createConnection(dbConfig);
    
    // 构建动态 SQL
    const updateFields: string[] = [];
    const values: any[] = [];
    
    // 安全过滤并收集需要更新的字段
    const allowedFields = ['orderStatus', 'paidAt', 'completedAt', 'remark', 'payAddress', 'chainType', 'shippingInfo'];
    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(payload[key]);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, message: "没有提供有效的更新字段" }, { status: 400 });
    }

    values.push(id);
    const sql = `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await connection.execute(sql, values);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}