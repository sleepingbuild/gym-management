'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf9f5', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        backgroundColor: '#181715',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              backgroundColor: '#cc785c',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#faf9f5', fontWeight: 400 }}>
              IronFit Pro
            </span>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #252320' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: '#cc785c',
            borderRadius: '9999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#faf9f5', fontSize: '13px', fontWeight: 500 }}>{user?.fullName}</p>
          <p style={{ color: '#a09d96', fontSize: '12px', marginTop: '2px' }}>{user?.role}</p>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <NavLinks role={user?.role} />
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}

function NavLinks({ role }: { role?: string }) {
  const links = role === 'ADMIN'
    ? [
        { href: '/admin', label: 'Tổng quan', icon: '◻' },
        { href: '/admin/users', label: 'Người dùng', icon: '◻' },
        { href: '/admin/memberships', label: 'Gói thành viên', icon: '◻' },
      ]
    : [
        { href: '/member', label: 'Tổng quan', icon: '◻' },
        { href: '/member/ai-chat', label: 'AI Trainer', icon: '◻' },
        { href: '/member/membership', label: 'Gói của tôi', icon: '◻' },
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {links.map((link) => (
        
          <a
            key={link.href}
            href={link.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
            color: '#a09d96',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#252320';
            e.currentTarget.style.color = '#faf9f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#a09d96';
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return (
    <button
      onClick={() => { logout(); router.push('/login'); }}
      style={{
        width: '100%', padding: '8px 12px',
        backgroundColor: 'transparent',
        border: 'none', borderRadius: '8px',
        color: '#a09d96', fontSize: '14px',
        cursor: 'pointer', textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#252320';
        e.currentTarget.style.color = '#c64545';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#a09d96';
      }}
    >
      Đăng xuất
    </button>
  );
}