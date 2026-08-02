'use client';

import { useEffect, useState } from 'react';
import { paymentService } from '@/services/payment.service';
import { MembershipPlan, membershipService, UserMembership } from '@/services/membership.service';
import { MembershipCard } from '@/components/membership/MembershipCard';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function MembershipPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansData, currentData] = await Promise.all([
        membershipService.getPlans(),
        membershipService.getCurrentMembership(),
      ]);
      setPlans(plansData);
      setCurrentMembership(currentData);
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = async (planId: string) => {
    setBuying(planId);
    try {
      const plan = plans.find((p) => p.id === planId);
      if (plan && plan.price === 0) {
        await membershipService.buyMembership(planId);
        alert('✅ Đăng ký thành công!');
        await fetchData();
        router.push('/member');
      } else {
        const { paymentUrl } = await paymentService.createPayment(planId, 'VNPAY');
        window.location.href = paymentUrl;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      alert(message);
    } finally {
      setBuying(null);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        'Hủy gói tập hiện tại? Bạn sẽ mất quyền lợi của gói này và có thể đăng ký gói mới ngay sau khi hủy.',
      )
    )
      return;
    setCancelling(true);
    try {
      await membershipService.cancelMembership();
      alert('✅ Đã hủy gói tập.');
      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Hủy gói thất bại. Vui lòng thử lại.';
      alert(`❌ ${message}`);
    } finally {
      setCancelling(false);
    }
  };

  const isPlanActive = (planId: string) => {
    return currentMembership?.planId === planId && currentMembership?.status === 'ACTIVE';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-display text-ink">Gói thành viên</h1>
        <p className="text-body text-muted mt-1">
          Chọn gói phù hợp để trải nghiệm đầy đủ tính năng của IronFit Pro
        </p>
      </div>

      {/* Current membership info */}
      {currentMembership && (
        <Card className="bg-primary/5 border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-body-sm text-muted">Gói hiện tại</p>
              <p className="text-title-md font-display text-ink">
                {currentMembership.plan.name}
              </p>
              <p className="text-body-sm text-muted">
                Hết hạn: {new Date(currentMembership.expiryDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                {currentMembership.status === 'ACTIVE' ? '🟢 Đang hoạt động' : '🔴 Đã hết hạn'}
              </span>
              {currentMembership.status === 'ACTIVE' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-3 py-1.5 text-sm text-error border border-error/40 rounded-full hover:bg-error/10 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Đang hủy...' : 'Hủy gói'}
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <MembershipCard
            key={plan.id}
            plan={plan}
            isCurrent={isPlanActive(plan.id)}
            onBuy={handleBuy}
            loading={buying === plan.id}
          />
        ))}
      </div>

      {/* Note */}
      <p className="text-body-sm text-muted-soft text-center mt-6">
        💳 Thanh toán an toàn qua VNPay hoặc MoMo. Mọi thắc mắc vui lòng liên hệ admin.
      </p>
    </div>
  );
}