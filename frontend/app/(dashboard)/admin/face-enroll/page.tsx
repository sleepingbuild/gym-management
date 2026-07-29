"use client";

import { useEffect, useRef, useState } from "react";
import { loadFaceApiModels, extractDescriptor } from "@/lib/faceApi";
import {
  faceService,
  EnrollableUser,
} from "@/services/face.service";

export default function FaceEnrollPage() {
  const [users, setUsers] = useState<EnrollableUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [modelsReady, setModelsReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadFaceApiModels()
      .then(() => setModelsReady(true))
      .catch(() => setStatusMsg("❌ Không tải được model nhận diện khuôn mặt."));
  }, []);

  useEffect(() => {
    faceService.getEnrollableUsers().then(setUsers).catch(console.error);
  }, []);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).slice(0, 5);
    setFiles(selected);
    setStatusMsg(null);
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      setStatusMsg("Vui lòng chọn 1 người trước.");
      return;
    }
    if (files.length === 0) {
      setStatusMsg("Vui lòng tải lên ít nhất 1 ảnh chân dung.");
      return;
    }
    if (!modelsReady) {
      setStatusMsg("Model nhận diện chưa sẵn sàng, vui lòng đợi.");
      return;
    }

    setProcessing(true);
    setStatusMsg(null);

    try {
      const descriptors: number[][] = [];

      for (const file of files) {
        const url = URL.createObjectURL(file);
        const img = imgRef.current!;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Không đọc được ảnh"));
          img.src = url;
        });

        const descriptor = await extractDescriptor(img);
        URL.revokeObjectURL(url);

        if (!descriptor) {
          setStatusMsg(
            `⚠️ Không tìm thấy khuôn mặt trong ảnh "${file.name}", ảnh này sẽ bị bỏ qua.`,
          );
          continue;
        }
        descriptors.push(descriptor);
      }

      if (descriptors.length === 0) {
        setStatusMsg("❌ Không trích được khuôn mặt từ bất kỳ ảnh nào.");
        return;
      }

      await faceService.enroll(selectedUserId, descriptors);
      setStatusMsg(`✅ Đăng ký khuôn mặt thành công (${descriptors.length} ảnh).`);
      setFiles([]);
      const updated = await faceService.getEnrollableUsers();
      setUsers(updated);
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Có lỗi xảy ra khi đăng ký khuôn mặt.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-display-md font-display text-ink">
          Đăng ký khuôn mặt
        </h1>
        <p className="text-body text-muted mt-1">
          Chọn 1 thành viên, tải lên 1–5 ảnh chân dung rõ mặt để đăng ký điểm
          danh bằng khuôn mặt.
        </p>
        {!modelsReady && (
          <p className="text-body-sm text-warning mt-2">
            Đang tải model nhận diện khuôn mặt...
          </p>
        )}
      </div>

      <div className="bg-surface-card border border-hairline rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-body-sm font-medium text-ink mb-2">
            Chọn người
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-sm text-ink outline-none focus:border-primary transition-colors"
          >
            <option value="">-- Chọn --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.role}) {u.hasProfile ? "— đã có khuôn mặt" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-body-sm font-medium text-ink mb-2">
            Ảnh chân dung (tối đa 5 ảnh)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white file:text-sm hover:file:bg-primary-active"
          />
          {files.length > 0 && (
            <p className="text-body-sm text-muted mt-2">
              Đã chọn {files.length} ảnh.
            </p>
          )}
        </div>

        {/* Dùng để face-api.js xử lý, ẩn khỏi giao diện */}
        <img ref={imgRef} alt="" className="hidden" />

        {statusMsg && <p className="text-body-sm text-ink">{statusMsg}</p>}

        <button
          onClick={handleSubmit}
          disabled={processing || !modelsReady}
          className="w-full bg-primary text-white text-sm font-medium py-3 rounded-md hover:bg-primary-active transition-colors disabled:opacity-50"
        >
          {processing ? "Đang xử lý..." : "Đăng ký khuôn mặt"}
        </button>
      </div>

      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          <span className="text-body-sm font-medium text-ink">
            Danh sách ({users.length})
          </span>
        </div>
        {users.map((u, i) => (
          <div
            key={u.id}
            className={`flex items-center justify-between px-5 py-3 ${
              i < users.length - 1 ? "border-b border-hairline" : ""
            }`}
          >
            <div>
              <p className="text-sm text-ink">{u.fullName}</p>
              <p className="text-body-sm text-muted">
                {u.email} · {u.role}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs ${
                u.hasProfile
                  ? "bg-success/10 text-success"
                  : "bg-hairline/40 text-muted"
              }`}
            >
              {u.hasProfile ? "Đã đăng ký" : "Chưa đăng ký"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
