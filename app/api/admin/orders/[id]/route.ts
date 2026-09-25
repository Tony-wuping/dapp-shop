import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeOrder(order: any) {
  return {
    id: order.id.toString(),
    orderNo: order.orderNo,
    userId: order.userId.toString(),
    walletAddress: order.walletAddress,
    nickname: order.nickname,
    productId: order.productId.toString(),
    productName: order.productName,
    productPrice: order.productPrice.toString(),
    coinType: order.coinType,
    chainType: order.chainType,
    payAddress: order.payAddress,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt ? order.createdAt.toISOString() : "",
    paidAt: order.paidAt ? order.paidAt.toISOString() : "",
    completedAt: order.completedAt ? order.completedAt.toISOString() : "",
    timeoutAt: order.timeoutAt ? order.timeoutAt.toISOString() : "",
    shippingInfo: order.shippingInfo || "",
    remark: order.remark || "",
  };
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const body = await req.json();

    const updateData: any = {};

    if (body.orderStatus !== undefined) {
      updateData.orderStatus = String(body.orderStatus);
    }

    if (body.shippingInfo !== undefined) {
      updateData.shippingInfo = String(body.shippingInfo);
    }

    if (body.remark !== undefined) {
      updateData.remark = String(body.remark);
    }

    if (body.payAddress !== undefined) {
      updateData.payAddress = String(body.payAddress);
    }

    if (body.chainType !== undefined) {
      updateData.chainType = String(body.chainType);
    }

    if (body.paidAt !== undefined) {
      updateData.paidAt = body.paidAt ? new Date(body.paidAt) : null;
    }

    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }

    if (body.timeoutAt !== undefined) {
      updateData.timeoutAt = body.timeoutAt ? new Date(body.timeoutAt) : null;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: serializeOrder(updated),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "更新订单失败" },
      { status: 500 }
    );
  }
}