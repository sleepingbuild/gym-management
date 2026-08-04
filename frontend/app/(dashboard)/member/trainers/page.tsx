"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { bookingService, Trainer } from "@/services/booking.service";

export default function MemberTrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    bookingService
      .getAvailableTrainers()
      .then(setTrainers)
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách huấn luyện viên. Vui lòng thử lại.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = (trainerId: string) => {
    // Chuyển sang trang đặt lịch, điền sẵn HLV vừa chọn
    router.push(`/member/bookings?trainerId=${trainerId}`);
  };

  const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-display-md text-ink">Huấn luyện viên</h1>
        <p className="text-muted text-body-sm mt-1">
          Chọn huấn luyện viên phù hợp để đặt lịch tập
        </p>
      </div>

      {error && (
        <div className="bg-error/10 text-error border border-error/30 rounded-lg p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-surface-card border border-hairline rounded-lg p-10 text-center text-muted">
          Đang tải...
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-surface-card border border-hairline rounded-lg p-10 text-center text-muted">
          Chưa có huấn luyện viên nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <Card key={t.id} className="p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-accent-orange text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                    {initial(t.user.fullName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-title-sm font-display text-ink truncate">
                      {t.user.fullName}
                    </h3>
                    <p className="text-body-sm text-muted truncate">{t.specialties}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mb-3 text-body-sm text-muted space-y-1.5 border-t border-hairline pt-3">
                    <p>
                      Email: <span className="text-ink">{t.user.email}</span>
                    </p>
                    <p>
                      Chuyên môn: <span className="text-ink">{t.specialties}</span>
                    </p>
                    <p>
                      Giới thiệu:{" "}
                      <span className="text-ink">{t.bio || "Chưa có thông tin giới thiệu."}</span>
                    </p>
                  </div>
                )}

                <div className="mt-auto flex gap-2 pt-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    className="flex-1 px-3 py-2 text-sm bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors"
                  >
                    {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                  <Button className="flex-1" onClick={() => handleRegister(t.user.id)}>
                    Đăng ký
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
