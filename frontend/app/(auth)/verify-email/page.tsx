"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu token xác nhận.");
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage("Email của bạn đã được xác nhận thành công!");
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Xác nhận thất bại. Link có thể đã hết hạn."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-card rounded-lg p-8 shadow-sm">
          {status === "loading" && (
            <p className="text-body text-muted">Đang xác nhận email...</p>
          )}
          {status === "success" && (
            <>
              <h2 className="text-title-lg font-display text-ink mb-2">
                ✅ Xác nhận thành công
              </h2>
              <p className="text-body-sm text-muted mb-6">{message}</p>
              <Link href="/login" className="btn-primary py-3 px-6 inline-block">
                Đăng nhập ngay
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <h2 className="text-title-lg font-display text-error mb-2">
                ❌ Xác nhận thất bại
              </h2>
              <p className="text-body-sm text-muted mb-6">{message}</p>
              <Link href="/register" className="text-primary hover:underline">
                Quay lại đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}