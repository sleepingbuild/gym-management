"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
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
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: editRoleValue });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: editRoleValue } : u)),
      );
      setEditRoleId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan =
      filterPlan === "ALL" ||
      (filterPlan === "NONE" && !u.userMembership) ||
      u.userMembership?.plan.name.toUpperCase() === filterPlan;
    return matchSearch && matchPlan;
  });

  const roleBadgeClass = (role: string) =>
    role === "ADMIN"
      ? "bg-primary text-white"
      : role === "PT"
        ? "bg-accent-teal/15 text-accent-teal"
        : "bg-surface-dark-elevated text-muted";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">Người dùng</h1>
        <p className="text-muted text-body-sm mt-1">
          Quản lý tất cả tài khoản trong hệ thống
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[280px] h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none placeholder:text-muted focus:border-primary transition-colors"
        />

        {["ALL", "NONE", "BASIC", "PREMIUM", "ELITE"].map((plan) => (
          <button
            key={plan}
            onClick={() => setFilterPlan(plan)}
            className={`h-10 px-4 rounded-lg text-[13px] font-medium transition-colors ${
              filterPlan === plan
                ? "bg-primary text-white"
                : "bg-surface-card text-muted hover:text-ink"
            }`}
          >
            {plan === "ALL" ? "Tất cả" : plan === "NONE" ? "Chưa có gói" : plan}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {[
            "Họ tên",
            "Email",
            "Số điện thoại",
            "Vai trò",
            "Gói",
            "Trạng thái",
            "Thao tác",
          ].map((h) => (
            <span
              key={h}
              className="text-[12px] font-semibold text-muted uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-10 text-center text-muted">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Không tìm thấy người dùng
          </div>
        ) : (
          filtered.map((user, index) => (
            <div
              key={user.id}
              className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] px-5 py-3.5 items-center ${
                index < filtered.length - 1 ? "border-b border-hairline" : ""
              } ${user.isActive ? "" : "opacity-50"}`}
            >
              {/* Name */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-medium">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-ink font-medium">
                  {user.fullName}
                </span>
              </div>

              {/* Email */}
              <span className="text-sm text-muted">{user.email}</span>

              {/* Phone */}
              <span className="text-sm text-muted">{user.phone ?? "—"}</span>

              {/* Role */}
              {editRoleId === user.id ? (
                <div className="flex gap-1 items-center">
                  <select
                    value={editRoleValue}
                    onChange={(e) => setEditRoleValue(e.target.value)}
                    className="text-xs px-1.5 py-0.5 rounded-md border border-hairline bg-surface-dark-soft text-ink"
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="PT">PT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    onClick={() => handleUpdateRole(user.id)}
                    className="text-[11px] px-2 py-0.5 bg-primary text-white rounded"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditRoleId(null)}
                    className="text-[11px] px-2 py-0.5 bg-surface-dark-elevated text-muted rounded"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${roleBadgeClass(user.role)}`}
                >
                  {user.role}
                </span>
              )}

              {/* Plan */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                  user.userMembership
                    ? "bg-primary text-white"
                    : "bg-surface-dark-elevated text-muted"
                }`}
              >
                {user.userMembership?.plan.name ?? "Chưa có"}
              </span>

              {/* Status */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit text-white ${
                  user.isActive ? "bg-success" : "bg-error"
                }`}
              >
                {user.isActive ? "Hoạt động" : "Đã khóa"}
              </span>

              {/* Actions */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setEditRoleId(user.id);
                    setEditRoleValue(user.role);
                  }}
                  className="px-2.5 py-1 text-xs bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`px-2.5 py-1 text-xs text-white rounded-md transition-colors ${
                    user.isActive
                      ? "bg-error hover:bg-error/80"
                      : "bg-success hover:bg-success/80"
                  }`}
                >
                  {user.isActive ? "Khóa" : "Mở"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-muted text-[13px] mt-3">
        {filtered.length} người dùng
      </p>
    </div>
  );
}