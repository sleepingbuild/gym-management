"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

interface Membership {
  status: string;
  startDate: string;
  expiryDate: string;
  aiDailyCount: number;
  aiUsageCount: number;
  plan: {
    name: string;
    aiDailyLimit: number;
    aiLimit: number;
    price: number;
  };
}

export default function MemberPage() {
  const { user } = useAuthStore();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [usage, setUsage] = useState<{
    aiDailyCount: number;
    aiUsageCount: number;
    aiDailyLimit: number;
    aiLimit: number;
    plan: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipRes, usageRes] = await Promise.all([
          api.get("/memberships/current"),
          api.get("/ai/usage"),
        ]);
        setMembership(membershipRes.data.data.membership);
        setUsage(usageRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const expiryDate = membership
    ? new Date(membership.expiryDate).toLocaleDateString("vi-VN")
    : null;
  const dailyPercent =
    usage && usage.aiDailyLimit !== -1
      ? Math.round((usage.aiDailyCount / usage.aiDailyLimit) * 100)
      : 0;

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
          Xin chào, {user?.fullName} 👋
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
        {/* Membership Card */}
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
            Gói hiện tại
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "24px",
              color: "#faf9f5",
              fontWeight: 400,
            }}
          >
            {membership?.plan.name ?? "Chưa có gói"}
          </p>
          {membership && (
            <p style={{ color: "#a09d96", fontSize: "13px", marginTop: "8px" }}>
              Hết hạn: {expiryDate}
            </p>
          )}
          {!membership && (
            <a
              href="/member/membership"
              style={{
                display: "inline-block",
                marginTop: "12px",
                backgroundColor: "#cc785c",
                color: "white",
                fontSize: "13px",
                padding: "6px 14px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Mua gói
            </a>
          )}
        </div>

        {/* Daily AI Usage */}
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
            AI hôm nay
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "24px",
              color: "#141413",
              fontWeight: 400,
            }}
          >
            {usage?.aiDailyCount ?? 0}
            <span style={{ fontSize: "16px", color: "#6c6a64" }}>
              /{usage?.aiDailyLimit === -1 ? "∞" : (usage?.aiDailyLimit ?? 0)}
            </span>
          </p>
          {/* Progress bar */}
          {usage?.aiDailyLimit !== -1 && (
            <div
              style={{
                marginTop: "12px",
                backgroundColor: "#e8e0d2",
                borderRadius: "9999px",
                height: "4px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#cc785c",
                  borderRadius: "9999px",
                  height: "4px",
                  width: `${Math.min(dailyPercent, 100)}%`,
                  transition: "width 0.3s",
                }}
              />
            </div>
          )}
        </div>

        {/* Monthly AI Usage */}
        <div
          style={{
            backgroundColor: "#f5f0e8",
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
            AI tháng này
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "24px",
              color: "#141413",
              fontWeight: 400,
            }}
          >
            {usage?.aiUsageCount ?? 0}
            <span style={{ fontSize: "16px", color: "#6c6a64" }}>
              /{usage?.aiLimit === -1 ? "∞" : (usage?.aiLimit ?? 0)}
            </span>
          </p>
          <p style={{ color: "#6c6a64", fontSize: "13px", marginTop: "8px" }}>
            Gói {usage?.plan ?? "None"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            color: "#141413",
            fontWeight: 400,
            marginBottom: "16px",
          }}
        >
          Truy cập nhanh
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <a
            href="/member/ai-chat"
            style={{
              backgroundColor: "#cc785c",
              borderRadius: "12px",
              padding: "20px",
              textDecoration: "none",
              display: "block",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              🤖 AI Trainer
            </p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
              Hỏi AI về tập luyện & dinh dưỡng
            </p>
          </a>
          <a
            href="/member/membership"
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
              Xem và nâng cấp gói của bạn
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
