"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BodyProgressRecord } from "@/services/bodyProgress.service";

interface ProgressHistoryProps {
  records: BodyProgressRecord[];
  onDelete?: (id: string) => void;
}

export function ProgressHistory({ records, onDelete }: ProgressHistoryProps) {
  if (records.length === 0) {
    return (
      <Card>
        <p className="text-body text-muted text-center py-8">
          Chưa có lịch sử theo dõi
        </p>
      </Card>
    );
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <h3 className="text-title-md font-display text-ink mb-4">
        Lịch sử theo dõi
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="text-left py-3 text-muted font-medium">Ngày</th>
              <th className="text-left py-3 text-muted font-medium">
                Cân nặng
              </th>
              <th className="text-left py-3 text-muted font-medium">BMI</th>
              <th className="text-left py-3 text-muted font-medium">Mỡ</th>
              <th className="text-left py-3 text-muted font-medium">Cơ</th>
              <th className="text-left py-3 text-muted font-medium">Ghi chú</th>
              <th className="text-right py-3 text-muted font-medium">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-hairline/50 hover:bg-surface-soft/50 transition-colors"
              >
                <td className="py-3">{formatDate(record.recordedAt)}</td>
                <td className="py-3 font-medium">{record.weight} kg</td>
                <td className="py-3">{record.bmi ?? "--"}</td>
                <td className="py-3">{record.bodyFat ?? "--"}%</td>
                <td className="py-3">{record.muscleMass ?? "--"} kg</td>
                <td className="py-3 text-muted-soft max-w-32 truncate">
                  {record.notes || "--"}
                </td>
                <td className="py-3 text-right">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(record.id)}
                      className="text-error hover:text-error/80"
                    >
                      Xóa
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
