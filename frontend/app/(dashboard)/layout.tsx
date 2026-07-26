"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  QrCodeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  BanknotesIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar */}
      <aside className="w-60 bg-surface-dark border-r border-hairline flex flex-col fixed top-0 left-0 bottom-0">
        {/* Logo */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-amber rounded-lg flex items-center justify-center shadow-glow">
              <SparklesIcon className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-display text-title-sm text-on-dark">
              IronFit Pro
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 pb-6 border-b border-hairline">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent-amber rounded-full flex items-center justify-center mb-2">
            <span className="text-on-primary text-sm font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-on-dark text-sm font-medium">{user?.fullName}</p>
          <p className="text-on-dark-soft text-xs mt-0.5">{user?.role}</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <NavLinks role={user?.role} pathname={pathname} />
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-hairline">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}

function NavLinks({ role, pathname }: { role?: string; pathname: string }) {
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const adminLinks = [
    { href: "/admin", label: "Tổng quan", icon: Squares2X2Icon },
    { href: "/admin/users", label: "Người dùng", icon: UsersIcon },
    { href: "/admin/memberships", label: "Gói thành viên", icon: CreditCardIcon },
    { href: "/admin/trainers", label: "Huấn luyện viên", icon: UserGroupIcon },
    { href: "/admin/bookings", label: "Đặt lịch", icon: CalendarIcon },
    { href: "/admin/payments", label: "Thanh toán", icon: BanknotesIcon },
    { href: "/admin/trainer-schedules", label: "Lịch làm việc HLV", icon: ClipboardDocumentListIcon },
    { href: "/admin/trainer-checkins", label: "Chấm công HLV", icon: ClockIcon },
  ];

  const memberLinks = [
  { href: "/member", label: "Tổng quan", icon: HomeIcon },
  { href: "/member/ai-chat", label: "AI Trainer", icon: ChatBubbleLeftRightIcon },
  { href: "/member/membership", label: "Gói của tôi", icon: CreditCardIcon },
  { href: "/member/check-in", label: "Check-in", icon: QrCodeIcon },
  { href: "/member/progress", label: "Tiến trình", icon: ChartBarIcon },
 ];

 const trainerLinks = [
  { href: "/pt", label: "Bảng điều khiển", icon: Squares2X2Icon },
  { href: "/pt/clients", label: "Khách hàng của tôi", icon: UserGroupIcon },
  { href: "/pt/schedule", label: "Thời khoá biểu", icon: CalendarIcon },
  { href: "/pt/progress", label: "Tiến trình hội viên", icon: ChartBarIcon },
  { href: "/pt/checkin", label: "Chấm công", icon: ClockIcon },
 ];

const links =
  role === "ADMIN" ? adminLinks : role === "PT" ? trainerLinks : memberLinks;
  return (
    <div className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors border-l-2
              ${
                active
                  ? "bg-surface-dark-elevated text-primary border-primary"
                  : "text-on-dark-soft border-transparent hover:bg-surface-dark-elevated hover:text-on-dark"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return (
    <button
      onClick={() => {
        logout();
        router.push("/login");
      }}
      className="
        w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-on-dark-soft
        hover:bg-surface-dark-elevated hover:text-error transition-colors
      "
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" />
      Đăng xuất
    </button>
  );
}