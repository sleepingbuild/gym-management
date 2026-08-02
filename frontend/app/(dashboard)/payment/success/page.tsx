"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-title-lg font-display text-ink mb-2">
        Thanh toán thành công!
      </h1>
      <p className="text-body-sm text-muted mb-6">
        Gói tập của bạn đã được kích hoạt.
        {paymentId && <span className="block mt-1 text-xs">Mã giao dịch: {paymentId}</span>}
      </p>
      <Link href="/member/membership" className="btn-primary py-3 px-6 inline-block">
        Xem gói tập của tôi
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}