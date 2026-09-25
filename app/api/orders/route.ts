import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "ORD-1790046610282",
        userId: "u_001",
        productName: "示例商品 A",
        price: "12 USDT",
        status: "待支付",
        time: "2026/9/22 11:10:10",
      },
      {
        id: "ORD-1790046491825",
        userId: "u_001",
        productName: "示例商品 B",
        price: "25 USDT",
        status: "待支付",
        time: "2026/9/22 11:08:11",
      },
    ],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, price } = body;

    if (!productName || !price) {
      return NextResponse.json(
        { success: false, message: "商品名和价格不能为空" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "订单创建成功",
      data: {
        id: "ORD-" + Date.now(),
        productName,
        price,
        status: "待支付",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "请求失败" },
      { status: 500 }
    );
  }
}