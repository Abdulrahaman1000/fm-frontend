// ============================================
// Client Form Component (Create/Edit)
// ============================================

import React, { useState, useEffect } from 'react';
import type { Client, CreateClientData } from '../../types';
import { isValidEmail, isValidPhoneNumber } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
// import Input from '@/components/common/Input';
// import Button from '@/components/common/Button';
// import { CreateClientData, Client } from '@/types';
// import { isValidEmail, isValidPhoneNumber } from '@/utils/validators';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateClientData>({
    company_name: '',
    address: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form if editing
  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name,
        address: client.address,
        phone: client.phone || '',
        email: client.email || '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid phone number format (e.g., 08012345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Company Name"
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        error={errors.company_name}
        required
        placeholder="Enter company name"
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter company address"
          rows={3}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="08012345678"
        helperText="Nigerian phone format"
        disabled={isLoading}
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="info@company.com"
        disabled={isLoading}
      />

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
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
          {client ? 'Update Client' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;