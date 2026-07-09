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
      <aside className="w-60 bg-surface-dark flex flex-col fixed top-0 left-0 bottom-0">
        {/* Logo */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-display text-base text-on-dark font-normal tracking-wide">
              IronFit Pro
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 pb-6 border-b border-surface-dark-elevated">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center mb-2">
            <span className="text-on-primary text-sm font-medium">
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
        <div className="px-3 py-4 border-t border-surface-dark-elevated">
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
  ];

  const memberLinks = [
    { href: "/member", label: "Tổng quan", icon: HomeIcon },
    { href: "/member/ai-chat", label: "AI Trainer", icon: ChatBubbleLeftRightIcon },
    { href: "/member/membership", label: "Gói của tôi", icon: CreditCardIcon },
  ];

  const links = role === "ADMIN" ? adminLinks : memberLinks;

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
              flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${
                active
                  ? "bg-surface-dark-elevated text-on-dark"
                  : "text-on-dark-soft hover:bg-surface-dark-elevated hover:text-on-dark"
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