// ============================================
// Invoice Status Breakdown Component
// ============================================

import React from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrency, formatStatus } from '../../utils/formatters';
// import { StatusBreakdown as StatusBreakdownType } from '@/types';
// import { formatCurrency, formatStatus } from '@/utils/formatters';

interface StatusBreakdownProps {
  breakdown: StatusBreakdownType[];
  isLoading?: boolean;
}

const StatusBreakdown: React.FC<StatusBreakdownProps> = ({ breakdown, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-3" />
        ))}
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    partial: 'bg-blue-500',
    paid: 'bg-green-500',
    cancelled: 'bg-red-500',
    draft: 'bg-gray-500',
  };

  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Invoice Status</h3>
      </div>

      <div className="p-6">
        {breakdown.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {breakdown.map((item) => {
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

              return (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          statusColors[item._id] || 'bg-gray-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {formatStatus(item._id)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        statusColors[item._id] || 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Total: {formatCurrency(item.total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBreakdown;