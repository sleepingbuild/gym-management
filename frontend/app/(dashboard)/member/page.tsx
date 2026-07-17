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
  trainer?: { fullName: string } | null;
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

  if (loading) return <div className="flex justify-center py-12 text-muted">Đang tải...</div>;

  const expiryDate = membership
    ? new Date(membership.expiryDate).toLocaleDateString("vi-VN")
    : null;
  const dailyPercent =
    usage && usage.aiDailyLimit !== -1
      ? Math.round((usage.aiDailyCount / usage.aiDailyLimit) * 100)
      : 0;

  const planDisplay = membership?.plan?.name ?? "Chưa có gói";
  const trainerName = membership?.trainer?.fullName ?? "Chưa có PT";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-ink tracking-tight">
          Xin chào, {user?.fullName} 👋
        </h1>
        <div className="flex flex-wrap items-baseline gap-2 text-sm text-muted mt-1">
          <span>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-xs text-muted-soft">•</span>
          <span>Trainer: {trainerName}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Membership Card */}
        <div className="bg-surface-dark border border-hairline rounded-xl p-6 transition-all duration-150 hover:border-primary/40">
          <p className="text-on-dark-soft text-xs font-medium uppercase tracking-wider mb-3">
            Gói hiện tại
          </p>
          <p className="font-display text-display-sm text-on-dark">
            {planDisplay}
          </p>
          {membership && (
            <p className="text-on-dark-soft text-sm mt-2">Hết hạn: {expiryDate}</p>
          )}
          {!membership && (
            <a
              href="/member/membership"
              className="inline-block mt-3 bg-primary text-white text-sm px-4 py-1.5 rounded-md no-underline hover:bg-primary-active transition-colors"
            >
              Mua gói
            </a>
          )}
        </div>

        {/* Daily AI Usage */}
        <div className="bg-surface-card border border-hairline rounded-xl p-6 transition-all duration-150 hover:border-primary/40">
          <p className="text-muted text-xs font-medium uppercase tracking-wider mb-3">
            AI hôm nay
          </p>
          <p className="font-display text-display-sm text-ink">
            {usage?.aiDailyCount ?? 0}
            <span className="text-base text-muted font-body">
              /{usage?.aiDailyLimit === -1 ? "∞" : (usage?.aiDailyLimit ?? 0)}
            </span>
          </p>
          {usage?.aiDailyLimit !== -1 && (
            <div className="mt-3 bg-hairline rounded-full h-1 w-full">
              <div
                className="bg-primary rounded-full h-1 transition-all duration-300"
                style={{ width: `${Math.min(dailyPercent, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Monthly AI Usage */}
        <div className="bg-surface-card border border-hairline rounded-xl p-6 transition-all duration-150 hover:border-primary/40">
          <p className="text-muted text-xs font-medium uppercase tracking-wider mb-3">
            AI tháng này
          </p>
          <p className="font-display text-display-sm text-ink">
            {usage?.aiUsageCount ?? 0}
            <span className="text-base text-muted font-body">
              /{usage?.aiLimit === -1 ? "∞" : (usage?.aiLimit ?? 0)}
            </span>
          </p>
          <p className="text-muted text-sm mt-2">
            {usage?.plan && usage.plan !== "None" ? `Gói ${usage.plan}` : "Chưa có gói"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-title-lg text-ink mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="/member/ai-chat"
            className="bg-primary text-white rounded-xl p-5 no-underline block hover:bg-primary-active transition-colors"
          >
            <p className="text-base font-medium mb-1">🤖 AI Trainer</p>
            <p className="text-white/75 text-sm">Hỏi AI về tập luyện & dinh dưỡng</p>
          </a>
          <a
            href="/member/membership"
            className="bg-surface-card border border-hairline rounded-xl p-5 no-underline block hover:border-primary/40 transition-colors"
          >
            <p className="text-ink text-base font-medium mb-1">💳 Gói thành viên</p>
            <p className="text-muted text-sm">Xem và nâng cấp gói của bạn</p>
          </a>
        </div>
      </div>
    </div>
  );
}