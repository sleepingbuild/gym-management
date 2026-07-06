"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  attendanceService,
  AttendanceRecord,
  AttendanceStats,
} from "@/services/attendance.service";

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrExpiry, setQrExpiry] = useState<string | null>(null);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchData = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        attendanceService.getHistory(10),
        attendanceService.getStats(),
      ]);
      setHistory(historyData);
      setStats(statsData);

      // Check if currently checked in
      const active = historyData.find((r) => r.checkOutTime === null);
      setIsCheckedIn(!!active);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const result = await attendanceService.generateQR(5);
      setQrCode(result.qrCode);
      setQrExpiry(result.qrExpiry);
      setAttendanceId(result.attendanceId);
      await fetchData();
    } catch (error) {
      console.error("Error generating QR:", error);
      alert("Không thể tạo QR. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!qrCode) {
      alert("Vui lòng tạo QR trước khi check-in.");
      return;
    }

    setLoading(true);
    try {
      await attendanceService.checkIn(qrCode);
      await fetchData();
      setIsCheckedIn(true);
      alert("✅ Check-in thành công!");
    } catch (error) {
      console.error("Error checking in:", error);
      alert("❌ Check-in thất bại. QR code có thể đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendanceId) {
      alert("Không tìm thấy attendance ID.");
      return;
    }

    setLoading(true);
    try {
      await attendanceService.checkOut(attendanceId, "Checked out");
      await fetchData();
      setIsCheckedIn(false);
      setQrCode(null);
      setAttendanceId(null);
      alert("✅ Check-out thành công!");
    } catch (error) {
      console.error("Error checking out:", error);
      alert("❌ Check-out thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-display text-ink">
          Check-in / Check-out
        </h1>
        <p className="text-body text-muted mt-1">
          Quét QR để check-in và check-out tại phòng gym
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-caption uppercase text-muted">Hôm nay</p>
          <p className="text-display-sm font-display text-ink">
            {stats?.today || 0}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Tháng này</p>
          <p className="text-display-sm font-display text-ink">
            {stats?.thisMonth || 0}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Tổng</p>
          <p className="text-display-sm font-display text-ink">
            {stats?.total || 0}
          </p>
        </Card>
      </div>

      {/* QR Section */}
      <Card>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-title-md font-display text-ink mb-2">
            {isCheckedIn ? "Bạn đã check-in" : "Check-in tại phòng gym"}
          </h3>

          {qrCode ? (
            <>
              <div className="bg-white p-4 rounded-lg mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-body-sm text-muted mb-4">
                Mã QR hết hạn lúc: {qrExpiry ? formatDate(qrExpiry) : "---"}
              </p>
            </>
          ) : (
            <p className="text-body text-muted mb-4">
              {isCheckedIn
                ? "Bạn đã check-in. Hãy check-out khi rời khỏi phòng gym."
                : 'Nhấn "Tạo QR" để tạo mã QR check-in.'}
            </p>
          )}

          <div className="flex gap-3 flex-wrap justify-center">
            {!isCheckedIn ? (
              <>
                <Button onClick={handleGenerateQR} disabled={loading}>
                  {loading ? "Đang tạo..." : "Tạo QR"}
                </Button>
                {qrCode && (
                  <Button
                    variant="secondary"
                    onClick={handleCheckIn}
                    disabled={loading}
                  >
                    Check-in
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={handleCheckOut}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Check-out"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* History */}
      <Card>
        <h3 className="text-title-md font-display text-ink mb-4">
          Lịch sử check-in
        </h3>
        {history.length === 0 ? (
          <p className="text-body text-muted text-center py-4">
            Chưa có lịch sử check-in
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="text-left py-2 text-muted font-medium">
                    Thời gian
                  </th>
                  <th className="text-left py-2 text-muted font-medium">
                    Check-in
                  </th>
                  <th className="text-left py-2 text-muted font-medium">
                    Check-out
                  </th>
                  <th className="text-left py-2 text-muted font-medium">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-hairline/50">
                    <td className="py-2">{formatDate(record.checkInTime)}</td>
                    <td className="py-2">
                      ✅ {formatDate(record.checkInTime)}
                    </td>
                    <td className="py-2">
                      {record.checkOutTime
                        ? formatDate(record.checkOutTime)
                        : "--"}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          record.checkOutTime
                            ? "bg-success/10 text-success"
                            : "bg-accent-amber/10 text-warning"
                        }`}
                      >
                        {record.checkOutTime ? "Hoàn thành" : "Đang check-in"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
