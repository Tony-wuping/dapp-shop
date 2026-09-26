import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 用于规范前端传回的订单数据
function normalizeOrder(row: any) {
  return {
    id: row.id,
    orderNo: row.orderNo ?? row.order_number ?? null,
    walletAddress: row.walletAddress ?? row.wallet_address ?? null,
    nickname: row.nickname ?? row.userNickname ?? row.user_nickname ?? null,
    productName: row.productName ?? row.product_name ?? row.product_title ?? null,
    price: row.price ?? row.amount ?? null,
    chain: row.chain ?? row.network ?? null,
    status: row.orderStatus ?? row.order_status ?? row.status ?? null,
    createdAt: row.createdAt ?? row.created_at ?? null,
    paidAt: row.paidAt ?? row.paid_at ?? null,
    completedAt: row.completedAt ?? row.completed_at ?? null,
    receivingAddress:
      row.receivingAddress ??
      row.deliveryAddress ??
      row.shippingAddress ??
      row.address ??
      null,
    shippingNo:
      row.shippingNo ??
      row.expressNo ??
      row.trackingNo ??
      row.logisticsNo ??
      row.courierNo ??
      null,
    paymentAddress: row.paymentAddress ?? row.payment_address ?? null,
    txHash: row.txHash ?? row.tx_hash ?? row.hash ?? null,
  };
}

// ✅ 获取订单列表
export async function GET() {
  try {
    // 使用原生 SQL 查询，兼容性更好
    const rows: any[] = await prisma.$queryRawUnsafe(
      'SELECT * FROM `orders` ORDER BY `id` DESC'
    );

    return NextResponse.json({
      success: true,
      data: rows.map(normalizeOrder),
    });
  } catch (error: any) {
    console.error('GET /api/admin/orders error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || '获取订单列表失败',
      },
      { status: 500 }
    );
  }
}

// ✅ 修改订单状态/物流信息 (修复了类型报错)
export async function PATCH(
  req: Request,
  { params }: { params: { slug?: string[] } }
) {
  try {
    // 从动态路由 slug 中获取订单 ID
    const id = params.slug?.[0];

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少订单ID' },
        { status: 400 }
      );
    }

    // 获取请求体
    const payload = await req.json().catch(() => ({}));

    // 允许更新的字段白名单 (安全校验)
    const allowedFields = [
      'orderStatus',
      'paidAt',
      'completedAt',
      'updatedAt',
      'walletAddress',
      'paymentAddress',
      'receivingAddress',
      'shippingNo',
      'expressNo',
      'trackingNo',
      'logisticsNo',
      'courierNo',
      'chain',
      'price',
      'nickname',
      'userNickname',
      'productName',
    ];

    const updateFields: string[] = [];
    const values: any[] = [];

    // 拼接 SQL 更新语句
    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        updateFields.push(`\`${key}\` = ?`);
        values.push(payload[key]);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: '没有可更新的字段' },
        { status: 400 }
      );
    }

    values.push(id);

    // 执行数据库更新
    await prisma.$executeRawUnsafe(
      `UPDATE \`orders\` SET ${updateFields.join(', ')} WHERE \`id\` = ?`,
      ...values
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PATCH /api/admin/orders error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || '更新订单失败',
      },
      { status: 500 }
    );
  }
}