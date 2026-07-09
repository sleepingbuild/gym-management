"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Chỉ redirect khi đã authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/member");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      const { user, tokens } = response.data.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      // ✅ router.push sẽ được xử lý bởi useEffect trên
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data?: { message?: string } } }).response
              ?.data?.message
          : "Đăng nhập thất bại";
      setError(message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-display-lg font-display text-ink">IronFit Pro</h1>
          <p className="text-body text-muted">Quản lý phòng gym thông minh</p>
        </div>

        {/* Card */}
        <div className="bg-surface-card rounded-lg p-8 shadow-sm">
          <h2 className="text-title-lg font-display text-ink text-center mb-2">
            Đăng nhập
          </h2>
          <p className="text-body-sm text-muted text-center mb-6">
            Chào mừng bạn trở lại
          </p>

          {error && (
            <div className="bg-error/10 text-error text-body-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-body-sm font-medium text-body block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-body-sm font-medium text-body block mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          {/* Link Đăng ký */}
          <div className="mt-4 text-center">
            <Link
              href="/register"
              className="text-body-sm text-primary hover:underline"
            >
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </div>
        </div>

        <p className="text-center text-body-sm text-muted-soft mt-6">
          IronFit Pro © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}