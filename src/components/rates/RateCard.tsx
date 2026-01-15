// ============================================
// Rate Card Component
// ============================================

import React from 'react';
import { Edit, Trash2, Tag, Clock, Radio as RadioIcon } from 'lucide-react';
import type { Rate } from '../../types';
import { cn } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
// import { Rate } from '@/types';
// import { formatCurrency } from '@/utils/formatters';
// import Button from '@/components/common/Button';
// import { cn } from '@/utils/helpers';

interface RateCardProps {
  rate: Rate;
  onEdit: (rate: Rate) => void;
  onDelete: (rate: Rate) => void;
}

const RateCard: React.FC<RateCardProps> = ({ rate, onEdit, onDelete }) => {
  const getRateId = (rate: Rate): string => {
    return (rate as any)._id || rate.id;
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    'Advert Spot': 'bg-blue-100 text-blue-800',
    'Jingle Production': 'bg-purple-100 text-purple-800',
    'Sponsored Programme': 'bg-green-100 text-green-800',
    'Announcement': 'bg-yellow-100 text-yellow-800',
    'Social Media Post': 'bg-pink-100 text-pink-800',
    'Other': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full',
                categoryColors[rate.category] || 'bg-gray-100 text-gray-800'
              )}
            >
              {rate.category}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(rate.price)}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {rate.duration && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Duration: {rate.duration}</span>
          </div>
        )}
        {rate.time_slot && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="h-4 w-4" />
            <span>Time Slot: {rate.time_slot}</span>
          </div>
        )}
        {rate.platform && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RadioIcon className="h-4 w-4" />
            <span>Platform: {rate.platform}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {rate.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {rate.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(rate)}
          fullWidth
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(rate)}
          fullWidth
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default RateCard;