'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MembershipPlan } from '@/services/membership.service';

interface MembershipCardProps {
  plan: MembershipPlan;
  isCurrent?: boolean;
  onBuy?: (planId: string) => void;
  loading?: boolean;
}

export function MembershipCard({ plan, isCurrent, onBuy, loading }: MembershipCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return `${price.toLocaleString('vi-VN')} VND`;
  };

  const isFree = plan.price === 0;

  return (
    <Card className={`relative p-6 transition-all hover:shadow-lg ${isCurrent ? 'border-2 border-primary' : ''}`}>
      {isCurrent && (
        <div className="absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
          Đang sử dụng
        </div>
      )}

      <div className="text-center">
        <h3 className="text-title-lg font-display text-ink">{plan.name}</h3>
        <p className="text-body-sm text-muted mt-1">{plan.description}</p>
      </div>

      <div className="text-center my-4">
        <span className="text-display-lg font-display text-ink">{formatPrice(plan.price)}</span>
        {plan.price > 0 && <span className="text-body-sm text-muted"> / tháng</span>}
      </div>

      <div className="space-y-2 text-body-sm text-body">
        <div className="flex justify-between">
          <span>AI tin nhắn mỗi ngày</span>
          <span className="font-medium">{plan.aiDailyLimit === -1 ? '♾️ Không giới hạn' : `${plan.aiDailyLimit} tin`}</span>
        </div>
        <div className="flex justify-between">
          <span>AI tin nhắn mỗi tháng</span>
          <span className="font-medium">{plan.aiLimit === -1 ? '♾️ Không giới hạn' : `${plan.aiLimit} tin`}</span>
        </div>
        <div className="flex justify-between">
          <span>Thời hạn</span>
          <span className="font-medium">{plan.duration} ngày</span>
        </div>
      </div>

      <div className="mt-6">
        {isCurrent ? (
          <Button variant="secondary" disabled className="w-full">
            ✅ Đã kích hoạt
          </Button>
        ) : isFree ? (
          <Button
            className="w-full"
            onClick={() => onBuy?.(plan.id)}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onBuy?.(plan.id)}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : `Mua gói ${plan.name}`}
          </Button>
        )}
      </div>
    </Card>
  );
}