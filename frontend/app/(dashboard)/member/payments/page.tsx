"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET /member/payments -> { data: {
 *   payments: [{
 *     id, amount, paymentMethod, status, transactionId, description, createdAt,
 *     membershipPlan: { id, name } | null
 *   }],
 *   stats: { totalAmount, totalCount, successCount, pendingCount }
 * } }
 * (Giống hệt shape /admin/payments nhưng backend tự lọc theo userId đang đăng nhập)
 */

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  transactionId: string | null;
  description: string | null;
  createdAt: string;
  membershipPlan: { id: string; name: string } | null;
}

interface Stats {
  totalAmount: number;
  totalCount: number;
  successCount: number;
  pendingCount: number;
}

const STATUS_LABEL: Record<Payment["status"], string> = {
  PENDING: "Đang xử lý",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const STATUS_CLASS: Record<Payment["status"], string> = {
  PENDING: "bg-warning text-white",
  SUCCESS: "bg-success text-white",
  FAILED: "bg-error text-white",
  REFUNDED: "bg-accent-teal text-white",
};

export default function MemberPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/history");
        setPayments(res.data.data.payments);
        setStats(res.data.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatAmount = (amount: number) => `${amount.toLocaleString("vi-VN")} VND`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Lịch sử thanh toán
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Toàn bộ giao dịch của bạn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Tổng tiền đã thanh toán
          </p>
          <p className="font-display text-display-sm text-ink">
            {stats ? formatAmount(stats.totalAmount) : "—"}
          </p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Tổng giao dịch
          </p>
          <p className="font-display text-display-sm text-ink">
            {stats?.totalCount ?? "—"}
          </p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">Thành công</p>
          <p className="font-display text-display-sm text-success">
            {stats?.successCount ?? "—"}
          </p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">Đang xử lý</p>
          <p className="font-display text-display-sm text-warning">
            {stats?.pendingCount ?? "—"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {["Ngày", "Số tiền", "Phương thức", "Trạng thái", "Nội dung"].map(
            (h) => (
              <span
                key={h}
                className="text-[12px] font-semibold text-muted uppercase tracking-wide"
              >
                {h}
              </span>
            ),
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted">Đang tải...</div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Bạn chưa có giao dịch nào
          </div>
        ) : (
          payments.map((p, index) => (
            <div
              key={p.id}
              className={`grid grid-cols-[1fr_1fr_1fr_1fr_1.5fr] px-5 py-3.5 items-center ${
                index < payments.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <span className="text-sm text-muted">
                {formatDate(p.createdAt)}
              </span>
              <span className="text-sm text-ink font-medium">
                {formatAmount(p.amount)}
              </span>
              <span className="text-sm text-muted">{p.paymentMethod}</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${STATUS_CLASS[p.status]}`}
              >
                {STATUS_LABEL[p.status]}
              </span>
              <span className="text-sm text-muted truncate">
                {p.description ?? p.membershipPlan?.name ?? "—"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}