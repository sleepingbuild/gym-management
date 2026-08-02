"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailedContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-4">❌</div>
      <h1 className="text-title-lg font-display text-error mb-2">
        Thanh toán thất bại
      </h1>
      <p className="text-body-sm text-muted mb-6">
        Giao dịch không thành công hoặc đã bị huỷ.
        {paymentId && <span className="block mt-1 text-xs">Mã giao dịch: {paymentId}</span>}
      </p>
      <Link href="/member/membership" className="btn-primary py-3 px-6 inline-block">
        Thử lại
      </Link>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedContent />
    </Suspense>
  );
}