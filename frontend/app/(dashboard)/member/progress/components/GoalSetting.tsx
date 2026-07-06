"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  bodyGoalService,
  BodyGoal,
  CreateGoalDTO,
} from "@/services/bodyGoal.service";

export function GoalSetting() {
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<BodyGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateGoalDTO>({
    targetWeight: undefined,
    targetBmi: undefined,
    targetBodyFat: undefined,
    targetMuscle: undefined,
    targetDate: "",
    notes: "",
  });

  const fetchGoal = async () => {
    try {
      const data = await bodyGoalService.getCurrent();
      setGoal(data);
      if (data) {
        setFormData({
          targetWeight: data.targetWeight || undefined,
          targetBmi: data.targetBmi || undefined,
          targetBodyFat: data.targetBodyFat || undefined,
          targetMuscle: data.targetMuscle || undefined,
          targetDate: data.targetDate.split("T")[0],
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dùng createOrUpdate thay vì create/update riêng
      await bodyGoalService.createOrUpdate({
        targetWeight: formData.targetWeight,
        targetBmi: formData.targetBmi,
        targetBodyFat: formData.targetBodyFat,
        targetMuscle: formData.targetMuscle,
        targetDate: formData.targetDate
          ? new Date(formData.targetDate).toISOString()
          : "",
        notes: formData.notes,
      });
      await fetchGoal();
      setIsEditing(false);
      alert("✅ Mục tiêu đã được lưu!");
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("❌ Không thể lưu mục tiêu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa mục tiêu?")) return;
    try {
      await bodyGoalService.deleteGoal();
      setGoal(null);
      setIsEditing(false);
      alert("✅ Mục tiêu đã được xóa!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("❌ Không thể xóa mục tiêu.");
    }
  };

  const handleCheckAchievement = async () => {
    try {
      const result = await bodyGoalService.checkAchievement();
      alert(result.message);
    } catch (error) {
      console.error("Error checking achievement:", error);
    }
  };

  if (isEditing || !goal) {
    return (
      <Card>
        <h3 className="text-title-md font-display text-ink mb-4">
          {goal ? "Cập nhật mục tiêu" : "Đặt mục tiêu mới"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cân nặng mục tiêu (kg)"
              type="number"
              step="0.1"
              value={formData.targetWeight || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetWeight: parseFloat(e.target.value),
                })
              }
            />
            <Input
              label="BMI mục tiêu"
              type="number"
              step="0.1"
              value={formData.targetBmi || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetBmi: parseFloat(e.target.value),
                })
              }
            />
            <Input
              label="Mỡ cơ thể mục tiêu (%)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.targetBodyFat || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetBodyFat: parseFloat(e.target.value),
                })
              }
            />
            <Input
              label="Cơ mục tiêu (kg)"
              type="number"
              step="0.1"
              value={formData.targetMuscle || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetMuscle: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <Input
            label="Ngày đạt mục tiêu"
            type="date"
            value={formData.targetDate}
            onChange={(e) =>
              setFormData({ ...formData, targetDate: e.target.value })
            }
          />
          <Input
            label="Ghi chú"
            type="text"
            placeholder="Nhập ghi chú..."
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : goal ? "Cập nhật" : "Tạo mục tiêu"}
            </Button>
            {goal && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </Card>
    );
  }

  // Display goal
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-title-md font-display text-ink">
            🎯 Mục tiêu hiện tại
          </h3>
          <p className="text-body-sm text-muted">
            {goal.status === "ACTIVE"
              ? "Đang theo dõi"
              : goal.status === "ACHIEVED"
                ? "✅ Đã đạt!"
                : "⏳ Đã hết hạn"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCheckAchievement}>
            Kiểm tra tiến độ
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            Sửa
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {goal.targetWeight && (
          <div>
            <p className="text-caption uppercase text-muted">
              Cân nặng mục tiêu
            </p>
            <p className="text-title-md font-display text-ink">
              {goal.targetWeight} kg
            </p>
          </div>
        )}
        {goal.targetBmi && (
          <div>
            <p className="text-caption uppercase text-muted">BMI mục tiêu</p>
            <p className="text-title-md font-display text-ink">
              {goal.targetBmi}
            </p>
          </div>
        )}
        {goal.targetBodyFat && (
          <div>
            <p className="text-caption uppercase text-muted">Mỡ mục tiêu</p>
            <p className="text-title-md font-display text-ink">
              {goal.targetBodyFat}%
            </p>
          </div>
        )}
        {goal.targetMuscle && (
          <div>
            <p className="text-caption uppercase text-muted">Cơ mục tiêu</p>
            <p className="text-title-md font-display text-ink">
              {goal.targetMuscle} kg
            </p>
          </div>
        )}
      </div>
      <p className="text-body-sm text-muted mt-4">
        Ngày dự kiến đạt:{" "}
        {new Date(goal.targetDate).toLocaleDateString("vi-VN")}
      </p>
      {goal.notes && (
        <p className="text-body-sm text-muted mt-2">📝 {goal.notes}</p>
      )}
    </Card>
  );
}
