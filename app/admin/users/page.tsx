"use client";

import { useState, useEffect } from 'react';

// 模拟的用户数据，等你对接好后端获取用户列表的接口后，这里会被替换
const MOCK_USERS = [
  { id: '1', wallet: '0x123...abc', nickname: '张三', email: 'zhangsan@example.com', phone: '13800138000', code: 'REF123', invite: 'INV456', level: 'VIP1', status: '正常', time: '2023-10-26' },
  { id: '2', wallet: '0xdef...ghi', nickname: '李四', email: 'lisi@example.com', phone: '13900139000', code: 'REF789', invite: 'INV012', level: '普通', status: '冻结', time: '2023-10-27' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 点击“管理”按钮
  const handleOpenModal = (user: any) => {
    setSelectedUser(user);
    setNewEmail(user.email); // 默认填入当前邮箱
    setNewPassword(''); // 密码清空
    setIsModalOpen(true);
  };

  // 提交修改
  const handleSubmit = async () => {
    if (!selectedUser) return;

    try {
      // 调用我们刚刚写的后端接口
      const res = await fetch('/api/admin/login', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: newEmail,
          password: newPassword || undefined, // 如果密码为空则不传
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        // 更新本地模拟数据，实际项目中应该重新请求后端接口
        setUsers(users.map(u => 
          u.id === selectedUser.id ? { ...u, email: newEmail } : u
        ));
        setIsModalOpen(false); // 关闭弹窗
      } else {
        alert('修改失败: ' + data.message);
      }
    } catch (error) {
      alert('网络请求失败');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">用户管理</h1>
      <p className="text-gray-500 mb-6 text-sm">这里可以查看用户、修改资料、修改密码、冻结或解冻账号。</p>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow"><h3 className="text-sm text-gray-400">用户总数</h3><p className="text-2xl font-bold mt-2">{users.length}</p></div>
        <div className="bg-gray-800 p-4 rounded-lg shadow"><h3 className="text-sm text-gray-400">正常用户</h3><p className="text-2xl font-bold mt-2">{users.filter(u => u.status === '正常').length}</p></div>
        <div className="bg-gray-800 p-4 rounded-lg shadow"><h3 className="text-sm text-gray-400">冻结用户</h3><p className="text-2xl font-bold mt-2">{users.filter(u => u.status === '冻结').length}</p></div>
      </div>

      {/* 搜索框 */}
      <div className="flex space-x-2 mb-6">
        <input type="text" placeholder="搜索钱包地址 / 昵称 / 推荐码 / 邀请人码" className="flex-grow p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">搜索</button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">重置</button>
      </div>

      {/* 用户表格 */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-700 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">钱包地址</th>
              <th className="px-6 py-3">昵称</th>
              <th className="px-6 py-3">邮箱</th>
              <th className="px-6 py-3">电话</th>
              <th className="px-6 py-3">推荐码</th>
              <th className="px-6 py-3">邀请人码</th>
              <th className="px-6 py-3">级别</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3">注册时间</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">{user.wallet}</td>
                  <td className="px-6 py-4">{user.nickname}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.code}</td>
                  <td className="px-6 py-4">{user.invite}</td>
                  <td className="px-6 py-4">{user.level}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === '正常' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.time}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      管理
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">暂无用户数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 修改信息弹窗 (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">修改用户信息</h2>
            <p className="text-sm text-gray-400 mb-4">用户: {selectedUser?.nickname}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">新邮箱</label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">重置密码</label>
                <input 
                  type="text" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="留空则不修改密码"
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">保存修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}