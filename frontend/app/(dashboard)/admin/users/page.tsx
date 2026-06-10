'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  userMembership: {
    status: string;
    expiryDate: string;
    plan: { name: string };
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#141413', fontWeight: 400, letterSpacing: '-0.5px' }}>
          Người dùng
        </h1>
        <p style={{ color: '#6c6a64', fontSize: '14px', marginTop: '4px' }}>
          Quản lý tất cả tài khoản trong hệ thống
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '320px', height: '40px',
            padding: '0 14px',
            backgroundColor: '#faf9f5',
            border: '1px solid #e6dfd8',
            borderRadius: '8px',
            fontSize: '14px', color: '#141413',
            outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e6dfd8', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
          padding: '12px 20px',
          backgroundColor: '#f5f0e8',
          borderBottom: '1px solid #e6dfd8',
        }}>
          {['Họ tên', 'Email', 'Vai trò', 'Gói', 'Ngày tạo'].map((h) => (
            <span key={h} style={{ fontSize: '12px', fontWeight: 500, color: '#6c6a64', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c6a64' }}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c6a64' }}>Không tìm thấy người dùng</div>
        ) : (
          filtered.map((user, index) => (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '14px 20px',
                borderBottom: index < filtered.length - 1 ? '1px solid #f5f0e8' : 'none',
                alignItems: 'center',
              }}
            >
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px',
                  backgroundColor: '#cc785c',
                  borderRadius: '9999px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: '#141413', fontWeight: 500 }}>{user.fullName}</span>
              </div>

              {/* Email */}
              <span style={{ fontSize: '14px', color: '#6c6a64' }}>{user.email}</span>

              {/* Role */}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px',
                backgroundColor: user.role === 'ADMIN' ? '#181715' : '#efe9de',
                color: user.role === 'ADMIN' ? '#faf9f5' : '#141413',
                borderRadius: '9999px',
                fontSize: '12px', fontWeight: 500,
                width: 'fit-content',
              }}>
                {user.role}
              </span>

              {/* Plan */}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px',
                backgroundColor: user.userMembership ? '#cc785c' : '#f5f0e8',
                color: user.userMembership ? 'white' : '#6c6a64',
                borderRadius: '9999px',
                fontSize: '12px', fontWeight: 500,
                width: 'fit-content',
              }}>
                {user.userMembership?.plan.name ?? 'Chưa có'}
              </span>

              {/* Date */}
              <span style={{ fontSize: '13px', color: '#6c6a64' }}>
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <p style={{ color: '#6c6a64', fontSize: '13px', marginTop: '12px' }}>
        {filtered.length} người dùng
      </p>
    </div>
  );
}