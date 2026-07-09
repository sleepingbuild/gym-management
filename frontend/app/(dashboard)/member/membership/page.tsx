'use client';

import { useEffect, useState } from 'react';
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
      const result = await membershipService.buyMembership(planId);
      alert('✅ Đăng ký thành công!');
      await fetchData();
      // Redirect đến trang payment nếu có
      router.push('/member/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      alert(`❌ ${message}`);
    } finally {
      setBuying(null);
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
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                {currentMembership.status === 'ACTIVE' ? '🟢 Đang hoạt động' : '🔴 Đã hết hạn'}
              </span>
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