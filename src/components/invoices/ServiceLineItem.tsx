// ============================================
// Service Line Item Component
// ============================================

import React from 'react';
import type { ServiceLine } from '../../types';
import { X } from 'lucide-react';
import Input from '../common/Input';
import { formatCurrency } from '../../utils/formatters';
// import { X } from 'lucide-react';
// import Input from '@/components/common/Input';
// import { ServiceLine } from '@/types';
// import { formatCurrency } from '@/utils/formatters';

interface ServiceLineItemProps {
  service: ServiceLine;
  index: number;
  onChange: (index: number, field: keyof ServiceLine, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const ServiceLineItem: React.FC<ServiceLineItemProps> = ({
  service,
  index,
  onChange,
  onRemove,
  canRemove,
}) => {
  const calculateTotals = () => {
    const totalSlots = service.daily_slots * service.campaign_days;
    const lineTotal = totalSlots * service.rate_per_slot;
    return { totalSlots, lineTotal };
  };

  const { totalSlots, lineTotal } = calculateTotals();

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900">Service #{index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <Input
          label="Description"
          value={service.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          placeholder="e.g., Mobile Phone & Solar Advertisement"
          required
        />

        <Input
          label="Duration"
          value={service.duration || ''}
          onChange={(e) => onChange(index, 'duration', e.target.value)}
          placeholder="e.g., 30 seconds"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Daily Slots"
            type="number"
            value={service.daily_slots}
            onChange={(e) => onChange(index, 'daily_slots', parseInt(e.target.value) || 0)}
            min="1"
            required
          />

          <Input
            label="Campaign Days"
            type="number"
            value={service.campaign_days}
            onChange={(e) => onChange(index, 'campaign_days', parseInt(e.target.value) || 0)}
            min="1"
            required
          />
        </div>

        <Input
          label="Rate per Slot (₦)"
          type="number"
          value={service.rate_per_slot}
          onChange={(e) => onChange(index, 'rate_per_slot', parseFloat(e.target.value) || 0)}
          min="0"
          required
        />

        {/* Calculated Totals */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Slots:</span>
            <span className="font-semibold text-gray-900">{totalSlots}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Line Total:</span>
            <span className="font-bold text-blue-600">{formatCurrency(lineTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLineItem;