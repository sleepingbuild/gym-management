"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET /pt/clients/progress -> { data: { progress: [{
 *   clientId, fullName, email,
 *   weight: number | null,
 *   bmi: number | null,
 *   bodyFat: number | null,
 *   muscleMass: number | null,
 *   recordedAt: string | null   // ISO, null nếu chưa có bản ghi BodyProgress nào
 * }] } }
 */

interface ProgressRow {
  clientId: string;
  fullName: string;
  email: string;
  weight: number | null;
  bmi: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  recordedAt: string | null;
}

export default function PTProgressPage() {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/pt/clients/progress");
        setRows(res.data.data.progress);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Tiến trình hội viên
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Số liệu ghi nhận gần nhất của tất cả hội viên bạn đang dạy
        </p>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.9fr_1.2fr_auto] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {["Học viên", "Cân nặng", "BMI", "% Mỡ", "Cơ bắp", "Ghi nhận gần nhất", "Thao tác"].map(
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
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Chưa có học viên nào
          </div>
        ) : (
          rows.map((r, index) => {
            const hasData = r.recordedAt !== null;
            return (
              <div
                key={r.clientId}
                className={`grid grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.9fr_1.2fr_auto] px-5 py-3.5 items-center ${
                  index < rows.length - 1 ? "border-b border-hairline" : ""
                }`}
              >
                <div>
                  <p className="text-sm text-ink font-medium">{r.fullName}</p>
                  <p className="text-xs text-muted">{r.email}</p>
                </div>

                {hasData ? (
                  <>
                    <span className="text-sm text-muted">
                      {r.weight != null ? `${r.weight} kg` : "—"}
                    </span>
                    <span className="text-sm text-muted">
                      {r.bmi ?? "—"}
                    </span>
                    <span className="text-sm text-muted">
                      {r.bodyFat != null ? `${r.bodyFat}%` : "—"}
                    </span>
                    <span className="text-sm text-muted">
                      {r.muscleMass != null ? `${r.muscleMass} kg` : "—"}
                    </span>
                    <span className="text-sm text-muted">
                      {formatDate(r.recordedAt as string)}
                    </span>
                    <span className="text-sm text-muted-soft">—</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-soft col-span-5">
                    Hội viên chưa ghi nhận tiến trình nào
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}