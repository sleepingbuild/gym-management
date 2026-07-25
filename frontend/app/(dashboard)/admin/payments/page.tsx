"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  transactionId: string | null;
  description: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string };
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

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/admin/payments", { params });
      setPayments(res.data.data.payments);
      setStats(res.data.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, fromDate, toDate, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatAmount = (amount: number) => `${amount.toLocaleString("vi-VN")} VND`;

  const handleExportCSV = () => {
    const header = [
      "Ngày",
      "Số tiền",
      "Phương thức",
      "Trạng thái",
      "Mã giao dịch",
      "Nội dung",
      "Người dùng",
      "Email",
    ];
    const rows = payments.map((p) => [
      formatDate(p.createdAt),
      p.amount,
      p.paymentMethod,
      STATUS_LABEL[p.status],
      p.transactionId ?? "",
      p.description ?? "",
      p.user.fullName,
      p.user.email,
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lich-su-thanh-toan-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md text-ink">
            Lịch sử thanh toán
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Toàn bộ giao dịch trong hệ thống
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={payments.length === 0}
          className="h-10 px-4 rounded-lg text-[13px] font-medium bg-surface-card border border-hairline text-ink hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xuất CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Tổng tiền thành công
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

      {/* Filters */}
      <div className="bg-surface-card border border-hairline rounded-lg p-4 mb-6 flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-body-sm text-muted block mb-1">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
          />
        </div>
        <div>
          <label className="text-body-sm text-muted block mb-1">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
          />
        </div>
        <div>
          <label className="text-body-sm text-muted block mb-1">Trạng thái</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Đang xử lý</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-body-sm text-muted block mb-1">Tìm kiếm</label>
          <input
            type="text"
            placeholder="Mã GD, nội dung, tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1.5fr_auto] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {[
            "Ngày",
            "Số tiền",
            "Phương thức",
            "Trạng thái",
            "Mã giao dịch",
            "Nội dung",
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

        {loading ? (
          <div className="p-10 text-center text-muted">Đang tải...</div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Không có giao dịch nào
          </div>
        ) : (
          payments.map((p, index) => (
            <div key={p.id}>
              <div
                className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1.5fr_auto] px-5 py-3.5 items-center ${
                  index < payments.length - 1 && expandedId !== p.id
                    ? "border-b border-hairline"
                    : ""
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
                  {p.transactionId ?? "—"}
                </span>
                <span className="text-sm text-muted truncate">
                  {p.description ?? "—"}
                </span>
                <button
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className="px-2.5 py-1 text-xs bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors w-fit"
                >
                  {expandedId === p.id ? "Ẩn" : "Chi tiết"}
                </button>
              </div>

              {expandedId === p.id && (
                <div
                  className={`px-5 pb-4 pt-1 bg-surface-dark-elevated/40 ${
                    index < payments.length - 1 ? "border-b border-hairline" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-body-sm">
                    <p className="text-muted">
                      Người dùng:{" "}
                      <span className="text-ink">{p.user.fullName}</span>
                    </p>
                    <p className="text-muted">
                      Email: <span className="text-ink">{p.user.email}</span>
                    </p>
                    <p className="text-muted">
                      Gói tập:{" "}
                      <span className="text-ink">
                        {p.membershipPlan?.name ?? "—"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className="text-muted text-[13px] mt-3">
        {payments.length} giao dịch
      </p>
    </div>
  );
}
