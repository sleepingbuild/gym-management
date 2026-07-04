'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
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
          <h2 className="text-title-lg font-display text-ink text-center mb-2">Đăng ký</h2>
          <p className="text-body-sm text-muted text-center mb-6">Tạo tài khoản mới</p>

          {error && (
            <div className="bg-error/10 text-error text-body-sm p-3 rounded-md mb-4 border border-error/20">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 text-success text-body-sm p-3 rounded-md mb-4 border border-success/20">
              ✅ Đăng ký thành công! Chuyển đến trang đăng nhập...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-body-sm font-medium text-body block mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-body-sm font-medium text-body block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-body-sm font-medium text-body block mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Tối thiểu 8 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="text-body-sm font-medium text-body block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full px-3.5 py-2.5 bg-canvas text-ink border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full btn-primary py-3"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-body-sm text-primary hover:underline">
              Đã có tài khoản? Đăng nhập
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