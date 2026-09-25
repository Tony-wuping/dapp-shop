import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: "u_001",
      nickname: "用户001",
      phone: "13800000000",
      avatar: "",
      balance: 100,
      address: "广东省深圳市",
      orderCount: 5,
    },
  });
}