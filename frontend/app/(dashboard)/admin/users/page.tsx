'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
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
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState('');

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

useEffect(() => {
  fetchUsers();
}, []);

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: editRoleValue });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: editRoleValue } : u));
      setEditRoleId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'ALL' ||
      (filterPlan === 'NONE' && !u.userMembership) ||
      u.userMembership?.plan.name.toUpperCase() === filterPlan;
    return matchSearch && matchPlan;
  });

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

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '280px', height: '40px', padding: '0 14px',
            backgroundColor: '#faf9f5', border: '1px solid #e6dfd8',
            borderRadius: '8px', fontSize: '14px', color: '#141413', outline: 'none',
          }}
        />

        {/* Filter by plan */}
        {['ALL', 'NONE', 'BASIC', 'PREMIUM', 'ELITE'].map((plan) => (
          <button
            key={plan}
            onClick={() => setFilterPlan(plan)}
            style={{
              height: '40px', padding: '0 16px',
              backgroundColor: filterPlan === plan ? '#181715' : '#f5f0e8',
              color: filterPlan === plan ? '#faf9f5' : '#6c6a64',
              border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            {plan === 'ALL' ? 'Tất cả' : plan === 'NONE' ? 'Chưa có gói' : plan}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e6dfd8', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr auto',
          padding: '12px 20px',
          backgroundColor: '#f5f0e8',
          borderBottom: '1px solid #e6dfd8',
        }}>
          {['Họ tên', 'Email', 'Số điện thoại', 'Vai trò', 'Gói', 'Trạng thái', 'Thao tác'].map((h) => (
            <span key={h} style={{ fontSize: '12px', fontWeight: 500, color: '#6c6a64', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c6a64' }}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c6a64' }}>Không tìm thấy người dùng</div>
        ) : (
          filtered.map((user, index) => (
            <div key={user.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr auto',
              padding: '14px 20px',
              borderBottom: index < filtered.length - 1 ? '1px solid #f5f0e8' : 'none',
              alignItems: 'center',
              opacity: user.isActive ? 1 : 0.5,
            }}>
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', backgroundColor: '#cc785c',
                  borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: '#141413', fontWeight: 500 }}>{user.fullName}</span>
              </div>

              {/* Email */}
              <span style={{ fontSize: '14px', color: '#6c6a64' }}>{user.email}</span>

              {/* Phone */}
              <span style={{ fontSize: '14px', color: '#6c6a64' }}>{user.phone ?? '—'}</span>

              {/* Role */}
              {editRoleId === user.id ? (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <select
                    value={editRoleValue}
                    onChange={(e) => setEditRoleValue(e.target.value)}
                    style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '6px', border: '1px solid #e6dfd8' }}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="PT">PT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button onClick={() => handleUpdateRole(user.id)} style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#cc785c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✓</button>
                  <button onClick={() => setEditRoleId(null)} style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#f5f0e8', color: '#6c6a64', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '3px 10px',
                  backgroundColor: user.role === 'ADMIN' ? '#181715' : user.role === 'PT' ? '#5db8a6' : '#efe9de',
                  color: user.role === 'ADMIN' || user.role === 'PT' ? '#faf9f5' : '#141413',
                  borderRadius: '9999px', fontSize: '12px', fontWeight: 500, width: 'fit-content',
                }}>
                  {user.role}
                </span>
              )}

              {/* Plan */}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px',
                backgroundColor: user.userMembership ? '#cc785c' : '#f5f0e8',
                color: user.userMembership ? 'white' : '#6c6a64',
                borderRadius: '9999px', fontSize: '12px', fontWeight: 500, width: 'fit-content',
              }}>
                {user.userMembership?.plan.name ?? 'Chưa có'}
              </span>

              {/* Status */}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '3px 10px',
                backgroundColor: user.isActive ? '#5db872' : '#c64545',
                color: 'white',
                borderRadius: '9999px', fontSize: '12px', fontWeight: 500, width: 'fit-content',
              }}>
                {user.isActive ? 'Hoạt động' : 'Đã khóa'}
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => { setEditRoleId(user.id); setEditRoleValue(user.role); }}
                  style={{
                    padding: '5px 10px', fontSize: '12px',
                    backgroundColor: '#f5f0e8', color: '#141413',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleToggleActive(user.id)}
                  style={{
                    padding: '5px 10px', fontSize: '12px',
                    backgroundColor: user.isActive ? '#c64545' : '#5db872',
                    color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                  }}
                >
                  {user.isActive ? 'Khóa' : 'Mở'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p style={{ color: '#6c6a64', fontSize: '13px', marginTop: '12px' }}>
        {filtered.length} người dùng
      </p>
    </div>
  );
}