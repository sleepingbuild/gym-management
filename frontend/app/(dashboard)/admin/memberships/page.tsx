"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  aiLimit: number;
  aiDailyLimit: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface PlanFormData {
  name: string;
  price: number;
  duration: number;
  aiLimit: number;
  aiDailyLimit: number;
  description: string;
}

const emptyForm: PlanFormData = {
  name: "",
  price: 0,
  duration: 30,
  aiLimit: 10,
  aiDailyLimit: 1,
  description: "",
};

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/admin/memberships");
      setPlans(res.data.data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (plan: Plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      aiLimit: plan.aiLimit,
      aiDailyLimit: plan.aiDailyLimit,
      description: plan.description ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/memberships/${editingId}`, form);
      } else {
        await api.post("/admin/memberships", form);
      }
      await fetchPlans();
      closeForm();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/admin/memberships/${id}/toggle-active`);
      setPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa gói tập này?")) return;
    try {
      await api.delete(`/admin/memberships/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể xóa gói tập."}`);
    }
  };

  const formatPrice = (price: number) =>
    price === 0 ? "Miễn phí" : `${price.toLocaleString("vi-VN")} VND`;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md text-ink">
            Quản lý gói tập
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Quản lý các gói tập luyện của phòng gym
          </p>
        </div>
        <Button onClick={openCreateForm}>+ Thêm gói tập</Button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-title-md font-display text-ink mb-4">
            {editingId ? "Cập nhật gói tập" : "Tạo gói tập mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên gói *"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Giá (VND) *"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                label="Thời hạn (ngày) *"
                type="number"
                min="1"
                required
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label="AI tin nhắn / tháng (-1 = không giới hạn) *"
                type="number"
                required
                value={form.aiLimit}
                onChange={(e) =>
                  setForm({ ...form, aiLimit: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                label="AI tin nhắn / ngày (-1 = không giới hạn) *"
                type="number"
                required
                value={form.aiDailyLimit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    aiDailyLimit: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <Input
              label="Mô tả"
              type="text"
              placeholder="Mô tả ngắn về gói tập..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo gói"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Plans grid */}
      {loading ? (
        <p className="text-muted text-center py-10">Đang tải...</p>
      ) : plans.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted">Chưa có gói tập nào.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <span
                className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  plan.isActive
                    ? "bg-success text-white"
                    : "bg-error text-white"
                }`}
              >
                {plan.isActive ? "Hoạt động" : "Đã khóa"}
              </span>

              <h3 className="text-title-lg font-display text-ink mb-1 pr-24">
                {plan.name}
              </h3>
              <p className="font-display text-display-sm text-primary mb-1">
                {formatPrice(plan.price)}
                {plan.price > 0 && (
                  <span className="text-body-sm text-muted font-body">
                    {" "}
                    / {plan.duration} ngày
                  </span>
                )}
              </p>
              {plan.description && (
                <p className="text-muted text-body-sm mb-4">
                  {plan.description}
                </p>
              )}

              <div className="space-y-1.5 text-body-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted">Thời hạn</span>
                  <span className="text-ink font-medium">
                    {plan.duration} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">AI / ngày</span>
                  <span className="text-ink font-medium">
                    {plan.aiDailyLimit === -1
                      ? "Không giới hạn"
                      : `${plan.aiDailyLimit} tin`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">AI / tháng</span>
                  <span className="text-ink font-medium">
                    {plan.aiLimit === -1
                      ? "Không giới hạn"
                      : `${plan.aiLimit} tin`}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openEditForm(plan)}
                >
                  Sửa
                </Button>
                <button
                  onClick={() => handleToggleActive(plan.id)}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    plan.isActive
                      ? "bg-error/10 text-error hover:bg-error/20"
                      : "bg-success/10 text-success hover:bg-success/20"
                  }`}
                >
                  {plan.isActive ? "Khóa" : "Mở"}
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="px-3 py-1.5 text-sm rounded-md font-medium text-error hover:bg-error/10 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}