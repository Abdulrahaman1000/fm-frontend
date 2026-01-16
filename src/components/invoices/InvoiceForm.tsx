
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Client, CreateInvoiceData, ServiceLine } from '../../types';
import { formatCurrency, formatDateForAPI } from '../../utils/formatters';
import Input from '../common/Input';
import Button from '../common/Button';
import ServiceLineItem from './ServiceLineItem';


interface InvoiceFormProps {
  clients: Client[];
  onSubmit: (data: CreateInvoiceData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  clients,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    client_id: '',
    invoice_type: 'proforma',
    invoice_date: formatDateForAPI(new Date()),
    services: [
      {
        description: '',
        duration: '',
        daily_slots: 1,
        campaign_days: 1,
        rate_per_slot: 0,
      },
    ],
    payment_terms: 'This bill is issued in advance and payment must be made before commencement of broadcast.',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper to get client ID
  const getClientId = (client: Client): string => {
    return (client as any)._id || client.id;
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalSlots = 0;
    let totalAmount = 0;

    formData.services.forEach((service) => {
      const slots = service.daily_slots * service.campaign_days;
      const amount = slots * service.rate_per_slot;
      totalSlots += slots;
      totalAmount += amount;
    });

    return { totalSlots, totalAmount };
  };

  const { totalSlots, totalAmount } = calculateTotals();

  // Handle service change
  const handleServiceChange = (index: number, field: keyof ServiceLine, value: any) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData((prev) => ({ ...prev, services: newServices }));
    
    // Clear errors for this service field
    if (errors[`service_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`service_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  // Add new service
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          description: '',
          duration: '',
          daily_slots: 1,
          campaign_days: 1,
          rate_per_slot: 0,
        },
      ],
    }));
  };

  // Remove service
  const removeService = (index: number) => {
    if (formData.services.length === 1) return;
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_id) {
      newErrors.client_id = 'Please select a client';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'At least one service is required';
    }

    formData.services.forEach((service, index) => {
      if (!service.description.trim()) {
        newErrors[`service_${index}_description`] = 'Description is required';
      }
      if (service.daily_slots <= 0) {
        newErrors[`service_${index}_daily_slots`] = 'Must be greater than 0';
      }
      if (service.campaign_days <= 0) {
        newErrors[`service_${index}_campaign_days`] = 'Must be greater than 0';
      }
      if (service.rate_per_slot <= 0) {
        newErrors[`service_${index}_rate`] = 'Must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Log the data being sent for debugging
    console.log('Submitting invoice data:', formData);

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling in parent
      console.error('Submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.client_id}
          onChange={(e) => {
            const selectedId = e.target.value;
            console.log('Selected client ID:', selectedId);
            setFormData((prev) => ({ ...prev, client_id: selectedId }));
            // Clear error
            if (errors.client_id) {
              const newErrors = { ...errors };
              delete newErrors.client_id;
              setErrors(newErrors);
            }
          }}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select a client</option>
          {clients && clients.length > 0 ? (
            clients.map((client) => {
              const clientId = getClientId(client);
              return (
                <option key={clientId} value={clientId}>
                  {client.company_name}
                </option>
              );
            })
          ) : (
            <option value="" disabled>No clients available</option>
          )}
        </select>
        {errors.client_id && <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>}
      </div>

      {/* Invoice Type and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Type
          </label>
          <select
            value={formData.invoice_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, invoice_type: e.target.value as any }))}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="proforma">Proforma Invoice</option>
            <option value="advance_bill">Advance Bill</option>
          </select>
        </div>

        <Input
          label="Invoice Date"
          type="date"
          value={formData.invoice_date}
          onChange={(e) => setFormData((prev) => ({ ...prev, invoice_date: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Services <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addService}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </div>

        <div className="space-y-4">
          {formData.services.map((service, index) => (
            <ServiceLineItem
              key={index}
              service={service}
              index={index}
              onChange={handleServiceChange}
              onRemove={removeService}
              canRemove={formData.services.length > 1}
            />
          ))}
        </div>
        {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Terms
        </label>
        <textarea
          value={formData.payment_terms}
          onChange={(e) => setFormData((prev) => ({ ...prev, payment_terms: e.target.value }))}
          rows={3}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={2}
          placeholder="Optional notes"
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {/* Totals Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">Total Slots:</span>
          <span className="text-xl font-bold text-gray-900">{totalSlots}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          Create Invoice
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;