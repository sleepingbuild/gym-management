"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/member");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError("Bạn cần đồng ý với Điều khoản sử dụng để tiếp tục.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        agreedToTerms: true,
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data?: { message?: string } } }).response
              ?.data?.message
          : "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-display-lg font-display text-ink">IronFit Pro</h1>
          <p className="text-body text-muted">Quản lý phòng gym thông minh</p>
        </div>

        <div className="bg-surface-card rounded-lg p-8 shadow-sm">
          <h2 className="text-title-lg font-display text-ink text-center mb-2">
            Đăng ký
          </h2>
          <p className="text-body-sm text-muted text-center mb-6">
            Tạo tài khoản mới
          </p>

          {error && (
            <div className="bg-error/10 text-error text-body-sm p-3 rounded-md mb-4 border border-error/20">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-title-sm font-display text-ink mb-2">
                Đăng ký thành công!
              </h3>
              <p className="text-body-sm text-muted mb-6">
                Chúng tôi đã gửi email xác nhận tới <strong>{formData.email}</strong>.
                Vui lòng kiểm tra hộp thư (kể cả mục Spam) và bấm vào liên kết
                để kích hoạt tài khoản trước khi đăng nhập.
              </p>
              <Link href="/login" className="text-primary hover:underline text-body-sm">
                Quay lại trang đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-body-sm font-medium text-body block mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-body-sm font-medium text-body block mb-1">
                    Email *
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
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Tối thiểu 8 ký tự"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-body-sm font-medium text-body block mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0123456789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="agreedToTerms" className="text-body-sm text-muted">
                    Tôi đã đọc và đồng ý với{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    của IronFit Pro
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-body-sm text-primary hover:underline"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-body-sm text-muted-soft mt-6">
          IronFit Pro © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}