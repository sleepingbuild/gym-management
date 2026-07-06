"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Stats {
  totalUsers: number;
  totalMembers: number;
  activeMembers: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch {
        // API chua co, dung placeholder
        setStats({ totalUsers: 0, totalMembers: 0, activeMembers: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "200px",
        }}
      >
        <p style={{ color: "#6c6a64" }}>Đang tải...</p>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px",
            color: "#141413",
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          Admin Dashboard
        </h1>
        <p style={{ color: "#6c6a64", fontSize: "14px", marginTop: "4px" }}>
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "#181715",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <p
            style={{
              color: "#a09d96",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Tổng người dùng
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              color: "#faf9f5",
              fontWeight: 400,
            }}
          >
            {stats?.totalUsers ?? 0}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#efe9de",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <p
            style={{
              color: "#6c6a64",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Thành viên
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              color: "#141413",
              fontWeight: 400,
            }}
          >
            {stats?.totalMembers ?? 0}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#cc785c",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Đang hoạt động
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              color: "white",
              fontWeight: 400,
            }}
          >
            {stats?.activeMembers ?? 0}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            color: "#141413",
            fontWeight: 400,
            marginBottom: "16px",
          }}
        >
          Quản lý
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <a
            href="/admin/users"
            style={{
              backgroundColor: "#efe9de",
              borderRadius: "12px",
              padding: "20px",
              textDecoration: "none",
              display: "block",
            }}
          >
            <p
              style={{
                color: "#141413",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              👥 Người dùng
            </p>
            <p style={{ color: "#6c6a64", fontSize: "13px" }}>
              Quản lý tài khoản thành viên
            </p>
          </a>
          <a
            href="/admin/memberships"
            style={{
              backgroundColor: "#efe9de",
              borderRadius: "12px",
              padding: "20px",
              textDecoration: "none",
              display: "block",
            }}
          >
            <p
              style={{
                color: "#141413",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              💳 Gói thành viên
            </p>
            <p style={{ color: "#6c6a64", fontSize: "13px" }}>
              Xem các gói đang hoạt động
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
