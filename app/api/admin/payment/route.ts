import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 获取收款设置
export async function GET() {
  try {
    const settings = await prisma.paymentSetting.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取数据失败' }, { status: 500 });
  }
}

// POST: 更新收款设置
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // 前端传来的应该是一个包含3条配置的数组
    const dataList = Array.isArray(body) ? body : [body];

    const results = await Promise.all(
      dataList.map(async (item) => {
        return prisma.paymentSetting.upsert({
          // 通过币种和链类型来定位唯一的数据
          where: {
            coinType_chainType: {
              coinType: item.coinType,
              chainType: item.chainType,
            },
          },
          update: {
            receiveAddress: item.receiveAddress,
            confirmCount: item.confirmCount,
            timeoutMinutes: item.timeoutMinutes,
            callbackUrl: item.callbackUrl,
            status: item.status,
          },
          create: {
            coinType: item.coinType,
            chainType: item.chainType,
            receiveAddress: item.receiveAddress,
            confirmCount: item.confirmCount || 1,
            timeoutMinutes: item.timeoutMinutes || 10,
            callbackUrl: item.callbackUrl || '',
            status: item.status || 1,
          },
        });
      })
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('保存收款设置失败:', error);
    return NextResponse.json({ success: false, error: '保存数据失败' }, { status: 500 });
  }
}