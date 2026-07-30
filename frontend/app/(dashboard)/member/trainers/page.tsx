"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET /member/trainers -> { data: { trainers: [{
 *   id, fullName, specialties, bio, status
 * }] } }
 * Chỉ nên trả về các trainer có status = "ACTIVE".
 */

interface Trainer {
  id: string;
  fullName: string;
  specialties: string;
  bio: string | null;
  status: string;
}

export default function MemberTrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get("/member/trainers");
        setTrainers(res.data.data.trainers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Huấn luyện viên
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Chọn huấn luyện viên phù hợp để đặt lịch tập
        </p>
      </div>

      {loading ? (
        <p className="text-muted text-center py-10">Đang tải...</p>
      ) : trainers.length === 0 ? (
        <div className="bg-surface-card border border-hairline rounded-lg text-center py-12">
          <p className="text-muted">Chưa có huấn luyện viên nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="bg-surface-card border border-hairline rounded-lg p-6 text-center transition-all duration-150 hover:border-primary/40"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-semibold">
                  {t.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-title-lg font-display text-ink">
                {t.fullName}
              </h3>
              <p className="text-primary text-body-sm mb-3">
                {t.specialties}
              </p>
              {t.bio && (
                <p className="text-muted text-body-sm mb-4">{t.bio}</p>
              )}
              <button
                onClick={() =>
                  router.push(`/member/bookings?trainerId=${t.id}`)
                }
                className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-md hover:bg-primary-active transition-colors"
              >
                Đặt lịch với HLV này
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}