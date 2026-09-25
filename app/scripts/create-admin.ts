import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 这里设置你的管理员账号和密码
  const username = 'Tony';
  const password = 'jianke19850621';  // 你可以改成自己想要的密码

  // 检查是否已存在
  const existing = await prisma.admin.findUnique({
    where: { username },
  });

  if (existing) {
    console.log('管理员账号已存在！');
    return;
  }

  // 创建管理员（密码先明文存储，后面会改成加密）
  await prisma.admin.create({
    data: {
      username,
      password,  // 实际生产环境应该用 bcrypt 加密
      role: 'admin',
    },
  });

  console.log(` 管理员账号创建成功！`);
  console.log(`用户名：${username}`);
  console.log(`密码：${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });