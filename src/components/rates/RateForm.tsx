// ============================================
// Rate Form Component (Create/Edit)
// ============================================

import React, { useState, useEffect } from 'react';
import type { CreateRateData, Rate } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
// import Input from '@/components/common/Input';
// import Button from '@/components/common/Button';
// import { CreateRateData, Rate } from '@/types';

interface RateFormProps {
  rate?: Rate;
  onSubmit: (data: CreateRateData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RateForm: React.FC<RateFormProps> = ({
  rate,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateRateData>({
    category: '',
    duration: '',
    time_slot: '',
    platform: '',
    price: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form if editing
  useEffect(() => {
    if (rate) {
      setFormData({
        category: rate.category,
        duration: rate.duration || '',
        time_slot: rate.time_slot || '',
        platform: rate.platform || '',
        price: rate.price,
        description: rate.description || '',
      });
    }
  }, [rate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">Select category</option>
          <option value="Advert Spot">Advert Spot</option>
          <option value="Jingle Production">Jingle Production</option>
          <option value="Sponsored Programme">Sponsored Programme</option>
          <option value="Announcement">Announcement</option>
          <option value="Social Media Post">Social Media Post</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 30s, 60s, 60min"
          helperText="Optional"
          disabled={isLoading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Slot
          </label>
          <select
            name="time_slot"
            value={formData.time_slot}
            onChange={handleChange}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select time slot</option>
            <option value="Prime">Prime</option>
            <option value="Mid-Prime">Mid-Prime</option>
            <option value="Off-Peak">Off-Peak</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Platform"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          placeholder="e.g., Radio, Facebook"
          helperText="Optional"
          disabled={isLoading}
        />

        <Input
          label="Price (₦)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
          rows={3}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

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
          {rate ? 'Update Rate' : 'Add Rate'}
        </Button>
      </div>
    </form>
  );
};

export default RateForm;