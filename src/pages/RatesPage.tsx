// ============================================
// Rates Page - COMPLETE WITH CRUD
// ============================================

import React, { useState } from 'react';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useApi } from '../hooks/useApi';
import rateService from '../services/rateService';
import type { CreateRateData, Rate } from '../types';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import RateCard from '../components/rates/RateCard';
import Modal from '../components/common/Modal';
import RateForm from '../components/rates/RateForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
// import { Plus, Filter } from 'lucide-react';
// import Header from '@/components/layout/Header';
// import Button from '@/components/common/Button';
// import Modal from '@/components/common/Modal';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import Loading from '@/components/common/Loading';
// import ErrorMessage from '@/components/common/ErrorMessage';
// import RateCard from '@/components/rates/RateCard';
// import RateForm from '@/components/rates/RateForm';
// import { useApi } from '@/hooks/useApi';
// import { useModal } from '@/hooks/useModal';
// import { useNotification } from '@/hooks/useNotification';
// import rateService from '@/services/rateService';
// import { Rate, CreateRateData } from '@/types';

const RatesPage: React.FC = () => {
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [rateToDelete, setRateToDelete] = useState<Rate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const { success, error: showError } = useNotification();

  // Fetch rates with filter
  const { data: rates, loading, error, refetch } = useApi(
    () => rateService.getRates({ category: categoryFilter || undefined }),
    [categoryFilter]
  );

  // Get rate ID helper
  const getRateId = (rate: Rate): string => {
    return (rate as any)._id || rate.id;
  };

  // Handle Create Rate
  const handleCreate = async (data: CreateRateData) => {
    try {
      setIsSubmitting(true);
      await rateService.createRate(data);
      success('Rate added successfully!');
      addModal.close();
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to create rate');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Rate
  const handleUpdate = async (data: CreateRateData) => {
    if (!selectedRate) return;

    try {
      setIsSubmitting(true);
      const rateId = getRateId(selectedRate);
      await rateService.updateRate(rateId, data);
      success('Rate updated successfully!');
      editModal.close();
      setSelectedRate(null);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to update rate');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Rate
  const handleDelete = async () => {
    if (!rateToDelete) return;

    try {
      setIsSubmitting(true);
      const rateId = getRateId(rateToDelete);
      await rateService.deleteRate(rateId);
      success('Rate deleted successfully!');
      deleteModal.close();
      setRateToDelete(null);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete rate');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (rate: Rate) => {
    setSelectedRate(rate);
    editModal.open();
  };

  // Open Delete Dialog
  const openDeleteDialog = (rate: Rate) => {
    setRateToDelete(rate);
    deleteModal.open();
  };

  // Group rates by category
  const groupedRates = rates?.reduce((acc, rate) => {
    const category = rate.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rate);
    return acc;
  }, {} as Record<string, Rate[]>);

  return (
    <div>
      <Header
        title="Rate Card"
        subtitle="Manage service rates and pricing"
        actions={
          <Button variant="primary" onClick={addModal.open}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        }
      />

      <div className="p-6">
        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Advert Spot">Advert Spot</option>
              <option value="Jingle Production">Jingle Production</option>
              <option value="Sponsored Programme">Sponsored Programme</option>
              <option value="Announcement">Announcement</option>
              <option value="Social Media Post">Social Media Post</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading rates..." />
        ) : error ? (
          <ErrorMessage message={error} retry={refetch} />
        ) : rates && rates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Rates Yet
              </h3>
              <p className="text-gray-600 mb-6">
                {categoryFilter
                  ? 'No rates found for this category.'
                  : 'Get started by adding your first rate.'}
              </p>
              {!categoryFilter && (
                <Button variant="primary" onClick={addModal.open}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Rate
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Rates Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {rates?.length || 0} rate{rates?.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rates Grid - Grouped by Category */}
            {groupedRates && Object.keys(groupedRates).map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedRates[category].map((rate) => (
                    <RateCard
                      key={getRateId(rate)}
                      rate={rate}
                      onEdit={openEditModal}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Rate Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        title="Add New Rate"
        size="lg"
      >
        <RateForm
          onSubmit={handleCreate}
          onCancel={addModal.close}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Rate Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setSelectedRate(null);
        }}
        title="Edit Rate"
        size="lg"
      >
        <RateForm
          rate={selectedRate || undefined}
          onSubmit={handleUpdate}
          onCancel={() => {
            editModal.close();
            setSelectedRate(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => {
          deleteModal.close();
          setRateToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Rate"
        message={`Are you sure you want to delete this rate (${rateToDelete?.category} - ${rateToDelete?.price})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default RatesPage;