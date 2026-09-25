import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST 请求，用于登录（保留原有功能）
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, message: '请输入用户名和密码' }, { status: 400 });
    }
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || admin.password !== password) {
      return NextResponse.json({ success: false, message: '用户名或密码错误' }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: { id: Number(admin.id), username: admin.username, role: admin.role },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器内部错误' }, { status: 500 });
  }
}

// PUT 请求，用于修改用户密码和邮箱（新增功能）
export async function PUT(req: NextRequest) {
  try {
    const { userId, email, password } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: '缺少用户ID' }, { status: 400 });
    }

    // 准备要更新的数据
    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    // 检查是否有数据需要更新
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: '没有提供需要修改的信息' }, { status: 400 });
    }

    // 在数据库中执行更新
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: '用户信息修改成功' });
  } catch (error) {
    console.error('Update User API Error:', error);
    return NextResponse.json({ success: false, message: '修改失败，用户可能不存在' }, { status: 500 });
  }
}