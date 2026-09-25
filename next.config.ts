/** @type {import('next').NextConfig} */
const nextConfig = {
  
  trailingSlash: true, // 添加尾部斜杠，解决静态托管问题
  images: { unoptimized: true }, // 关闭图片优化，适配静态导出
}

module.exports = nextConfig