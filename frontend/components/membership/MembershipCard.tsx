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
          Đang dùng
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="font-display text-2xl text-ink mb-2">{plan.name}</h3>
        <p className="text-muted text-sm mb-4">{plan.description}</p>
        <div className="font-display text-3xl text-ink">
          {isFree ? (
            formatPrice(plan.price)
          ) : (
            <>
              {formatPrice(plan.price)}
              <span className="text-base text-muted font-body"> / tháng</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">AI tin nhắn mỗi ngày</span>
          <span className="font-medium text-ink">
            {plan.aiDailyLimit === -1 ? '♾️ Không giới hạn' : `${plan.aiDailyLimit} tin`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">AI tin nhắn mỗi tháng</span>
          <span className="font-medium text-ink">
            {plan.aiLimit === -1 ? '♾️ Không giới hạn' : `${plan.aiLimit} tin`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Thời hạn</span>
          <span className="font-medium text-ink">{plan.duration} ngày</span>
        </div>
      </div>

      {isCurrent ? (
        <Button className="w-full" disabled>
          Đã kích hoạt
        </Button>
      ) : (
        <Button className="w-full" onClick={() => onBuy?.(plan.id)} disabled={loading}>
          {loading ? 'Đang xử lý...' : isFree ? 'Đăng ký ngay' : `Mua gói ${plan.name}`}
        </Button>
      )}
    </Card>
  );
}