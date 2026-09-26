"use client";

import { useState, useEffect } from "react";

// 1. 定义用户数据的接口类型
interface User {
  id: string;
  nickname: string;
  walletAddress: string;
  email: string | null;
  createdAt: string;
  isBanned: boolean;
}

export default function UsersPage() {
  // 2. 为 useState 添加泛型类型定义
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // 获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&pageSize=${pageSize}&search=${search}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("获取用户失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // 封禁/解封用户
  const handleToggleBan = async (id: string, isBanned: boolean) => {
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !isBanned }),
      });
      fetchUsers();
    } catch (error) {
      console.error("更新用户状态失败:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">用户管理</h1>

      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索昵称/邮箱/钱包地址..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] p-3 rounded bg-[#1e293b] text-white border border-[#334155]"
        />
      </div>

      {loading && <div className="text-center py-10 text-gray-400">加载中...</div>}
      {!loading && users.length === 0 && <div className="text-center py-10 text-gray-400">暂无用户数据</div>}

      {!loading && users.length > 0 && (
        <>
          {/* --- PC端表格视图 --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e293b] text-gray-400 text-sm">
                  <th className="p-4 rounded-tl-lg">用户</th>
                  <th className="p-4">钱包地址</th>
                  <th className="p-4">邮箱</th>
                  <th className="p-4">注册时间</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 rounded-tr-lg">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#334155] hover:bg-[#1e293b]/50">
                    <td className="p-4">{user.nickname}</td>
                    <td className="p-4 font-mono text-xs">{user.walletAddress}</td>
                    <td className="p-4">{user.email || "-"}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.isBanned ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                        {user.isBanned ? '已封禁' : '正常'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleBan(user.id, user.isBanned)}
                        className={`px-3 py-1 rounded text-xs ${user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {user.isBanned ? '解封' : '封禁'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- 手机端卡片视图 --- */}
          <div className="md:hidden flex flex-col gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#334155]">
                  <div className="font-bold text-lg">{user.nickname}</div>
                  <span className={`px-2 py-1 rounded text-xs ${user.isBanned ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {user.isBanned ? '已封禁' : '正常'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">钱包地址</span>
                    <span className="text-right max-w-[60%] font-mono text-xs break-all">{user.walletAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">绑定邮箱</span>
                    <span className="text-right">{user.email || "未绑定"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">注册时间</span>
                    <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#334155] flex justify-end">
                  <button
                    onClick={() => handleToggleBan(user.id, user.isBanned)}
                    className={`px-4 py-2 rounded text-sm ${user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {user.isBanned ? '解封用户' : '封禁用户'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 分页控件 */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-[#1e293b] disabled:opacity-50"
        >
          上一页
        </button>
        <span className="text-gray-400">
          第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(total / pageSize)}
          className="px-4 py-2 rounded bg-[#1e293b] disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}