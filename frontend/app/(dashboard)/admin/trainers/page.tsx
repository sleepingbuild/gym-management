"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Trainer {
  id: string; // TrainerProfile.id
  userId: string;
  specialties: string;
  bio: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    isActive: boolean;
    createdAt: string;
  };
}

interface CreateFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  specialties: string;
  bio: string;
}

interface EditFormData {
  fullName: string;
  phone: string;
  specialties: string;
  bio: string;
  status: string;
}

const emptyCreateForm: CreateFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  specialties: "",
  bio: "",
};

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormData>(emptyCreateForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchTrainers = async () => {
    try {
      const res = await api.get("/admin/trainers");
      setTrainers(res.data.data.trainers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/trainers", createForm);
      await fetchTrainers();
      setShowCreateForm(false);
      setCreateForm(emptyCreateForm);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra."}`);
    } finally {
      setSaving(false);
    }
  };

  const openEditForm = (trainer: Trainer) => {
    setEditingId(trainer.id);
    setEditForm({
      fullName: trainer.user.fullName,
      phone: trainer.user.phone ?? "",
      specialties: trainer.specialties,
      bio: trainer.bio ?? "",
      status: trainer.status,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm) return;
    setSaving(true);
    try {
      await api.put(`/admin/trainers/${editingId}`, editForm);
      await fetchTrainers();
      setEditingId(null);
      setEditForm(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa huấn luyện viên này? Tài khoản sẽ được hạ về MEMBER."))
      return;
    try {
      await api.delete(`/admin/trainers/${id}`);
      setTrainers((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể xóa."}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md text-ink">
            Huấn luyện viên
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Quản lý hồ sơ và trạng thái huấn luyện viên
          </p>
        </div>
        <Button onClick={() => setShowCreateForm((v) => !v)}>
          + Thêm huấn luyện viên
        </Button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <Card className="mb-6">
          <h3 className="text-title-md font-display text-ink mb-4">
            Thêm huấn luyện viên mới
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ tên *"
                type="text"
                required
                value={createForm.fullName}
                onChange={(e) =>
                  setCreateForm({ ...createForm, fullName: e.target.value })
                }
              />
              <Input
                label="Email *"
                type="email"
                required
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
              />
              <Input
                label="Mật khẩu * (tối thiểu 8 ký tự)"
                type="password"
                required
                minLength={8}
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
              />
              <Input
                label="Số điện thoại"
                type="text"
                value={createForm.phone}
                onChange={(e) =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
              />
              <Input
                label="Chuyên môn * (VD: Yoga, Giảm cân)"
                type="text"
                required
                value={createForm.specialties}
                onChange={(e) =>
                  setCreateForm({ ...createForm, specialties: e.target.value })
                }
              />
            </div>
            <Input
              label="Mô tả ngắn"
              type="text"
              placeholder="VD: 5 năm kinh nghiệm huấn luyện thể hình"
              value={createForm.bio}
              onChange={(e) =>
                setCreateForm({ ...createForm, bio: e.target.value })
              }
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Đang tạo..." : "Tạo huấn luyện viên"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Trainers grid */}
      {loading ? (
        <p className="text-muted text-center py-10">Đang tải...</p>
      ) : trainers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted">Chưa có huấn luyện viên nào.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map((trainer) => {
            const isEditing = editingId === trainer.id;
            const isExpanded = expandedId === trainer.id;
            const isActive = trainer.status === "ACTIVE";

            if (isEditing && editForm) {
              return (
                <Card key={trainer.id}>
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <Input
                      label="Họ tên"
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                    />
                    <Input
                      label="Số điện thoại"
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                    <Input
                      label="Chuyên môn"
                      type="text"
                      value={editForm.specialties}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          specialties: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Mô tả"
                      type="text"
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                    />
                    <div className="space-y-1.5">
                      <label className="text-body-sm font-medium text-body">
                        Trạng thái
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-ink text-body-md"
                      >
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Ngừng hoạt động</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button type="submit" size="sm" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </Card>
              );
            }

            return (
              <Card key={trainer.id} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-semibold">
                    {trainer.user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-title-lg font-display text-ink">
                  {trainer.user.fullName}
                </h3>
                <p className="text-primary text-body-sm mb-2">
                  {trainer.specialties}
                </p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${
                    isActive ? "bg-success text-white" : "bg-error text-white"
                  }`}
                >
                  {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </span>
                {trainer.bio && (
                  <p className="text-muted text-body-sm mb-3">
                    {trainer.bio}
                  </p>
                )}

                {isExpanded && (
                  <div className="text-left bg-surface-dark-elevated rounded-md p-3 mb-3 space-y-1">
                    <p className="text-body-sm text-muted">
                      Email: <span className="text-ink">{trainer.user.email}</span>
                    </p>
                    <p className="text-body-sm text-muted">
                      SĐT: <span className="text-ink">{trainer.user.phone ?? "—"}</span>
                    </p>
                    <p className="text-body-sm text-muted">
                      Tham gia:{" "}
                      <span className="text-ink">
                        {new Date(trainer.user.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : trainer.id)
                    }
                  >
                    {isExpanded ? "Ẩn" : "Chi tiết"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditForm(trainer)}
                  >
                    Sửa
                  </Button>
                  <button
                    onClick={() => handleDelete(trainer.id)}
                    className="px-3 py-1.5 text-sm rounded-md font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}