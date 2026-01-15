// ============================================
// Client Card Component - FIXED
// ============================================

import React from 'react';
import { Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import type { Client } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
// import { Client } from '@/types';
// import { formatCurrency } from '@/utils/formatters';
// import Button from '@/components/common/Button';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onClick?: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  onClick,
}) => {
  // Get the correct ID (handle both _id and id)
  const clientId = (client as any)._id || client.id;

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {client.company_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{client.address}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-3 gap-3 py-3 mb-4 border-t border-b border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Invoiced</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(client.total_invoiced || 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Paid</p>
          <p className="text-sm font-semibold text-green-600">
            {formatCurrency(client.total_paid || 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Outstanding</p>
          <p className="text-sm font-semibold text-orange-600">
            {formatCurrency(client.outstanding_balance || 0)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Edit clicked for client:', clientId); // Debug log
            onEdit(client);
          }}
          fullWidth
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Delete clicked for client:', clientId); // Debug log
            onDelete(client);
          }}
          fullWidth
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ClientCard;