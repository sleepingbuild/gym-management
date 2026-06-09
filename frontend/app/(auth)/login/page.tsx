'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', data);
            const { user, tokens } = res.data.data;
            setAuth(user, tokens.accessToken, tokens.refreshToken);

            if (user.role === 'ADMIN') router.push('/admin');
            else if (user.role === 'PT') router.push('/pt');
            else router.push('/member');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="white" fillOpacity="0.9" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-4xl text-ink tracking-tight">IronFit Pro</h1>
                    <p className="text-muted text-sm mt-2 font-sans">Quản lý phòng gym thông minh</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-hairline rounded-xl p-8 shadow-sm">
                    <h2 className="font-serif text-2xl text-ink mb-1">Đăng nhập</h2>
                    <p className="text-muted text-sm mb-6 font-sans">Chào mừng bạn trở lại</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-body-strong mb-1.5">
                                Email
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="your@email.com"
                                className="w-full h-10 px-3.5 bg-canvas border border-hairline rounded-md text-ink text-sm font-sans placeholder:text-muted-soft focus:outline-none transition-colors"
                                style={{ backgroundColor: '#faf9f5', border: '1px solid #e6dfd8', borderRadius: '8px' }}
                            />
                            {errors.email && (
                                <p className="text-error text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-body-strong mb-1.5">
                                Mật khẩu
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-10 px-3.5 bg-canvas border border-hairline rounded-md text-ink text-sm font-sans placeholder:text-muted-soft focus:outline-none transition-colors"
                                style={{ backgroundColor: '#faf9f5', border: '1px solid #e6dfd8', borderRadius: '8px' }}
                            />
                            {errors.password && (
                                <p className="text-error text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-error/10 border border-error/20 rounded-md px-3.5 py-2.5">
                                <p className="text-error text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: loading ? '#e6dfd8' : '#cc785c' }}
                            className="w-full h-10 text-white text-sm font-medium rounded-md transition-colors hover:opacity-90"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-muted text-xs mt-6 font-sans">
                    IronFit Pro © 2026
                </p>

            </div>
        </div>
    );
}