'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateProgressDTO } from '@/services/bodyProgress.service';

interface ProgressFormProps {
  onSubmit: (data: CreateProgressDTO) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export function ProgressForm({ onSubmit, loading, onCancel }: ProgressFormProps) {
  const [formData, setFormData] = useState<CreateProgressDTO>({
    weight: 0,
    height: undefined,
    bodyFat: undefined,
    muscleMass: undefined,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({
      weight: 0,
      height: undefined,
      bodyFat: undefined,
      muscleMass: undefined,
      notes: '',
    });
  };

  return (
    <Card>
      <h3 className="text-title-md font-display text-ink mb-4">
        Thêm record mới
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cân nặng (kg) *"
            type="number"
            step="0.1"
            required
            value={formData.weight || ''}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Chiều cao (cm)"
            type="number"
            step="0.1"
            value={formData.height || ''}
            onChange={(e) =>
              setFormData({ ...formData, height: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Mỡ cơ thể (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.bodyFat || ''}
            onChange={(e) =>
              setFormData({ ...formData, bodyFat: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Khối lượng cơ (kg)"
            type="number"
            step="0.1"
            value={formData.muscleMass || ''}
            onChange={(e) =>
              setFormData({ ...formData, muscleMass: parseFloat(e.target.value) })
            }
          />
        </div>
        <Input
          label="Ghi chú"
          type="text"
          placeholder="Nhập ghi chú..."
          value={formData.notes || ''}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu record'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Hủy
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}