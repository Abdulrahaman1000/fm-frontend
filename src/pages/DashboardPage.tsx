// ============================================
// Dashboard Page - COMPLETE
// ============================================

// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import dashboardService from '../services/dashboardService';
import Header from '../components/layout/Header';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import StatsCard from '../components/dashboard/StatsCard';
import { formatCurrency } from '../utils/formatters';
// import StatusBreakdown from '../components/dashboard/StatusBreakdown';
import RecentInvoices from '../components/dashboard/RecentInvoices';
import RecentPayments from '../components/dashboard/RecentPayments';
import StatusBreakdownCard from '../components/dashboard/StatusBreakdownCard';

// import Header from '@/components/layout/Header';
// import StatsCard from '@/components/dashboard/StatsCard';
// import RecentInvoices from '@/components/dashboard/RecentInvoices';
// import RecentPayments from '@/components/dashboard/RecentPayments';
// import StatusBreakdown from '@/components/dashboard/StatusBreakdown';
// import Button from '@/components/common/Button';
// import Loading from '@/components/common/Loading';
// import ErrorMessage from '@/components/common/ErrorMessage';
// import { useApi } from '@/hooks/useApi';
// import dashboardService from '@/services/dashboardService';
// import { formatCurrency } from '@/utils/formatters';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, loading, error, refetch } = useApi(
    () => dashboardService.getDashboardStats(),
    []
  );

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your radio station invoicing" />
        <div className="p-6">
          <Loading message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your radio station invoicing" />
        <div className="p-6">
          <ErrorMessage message={error} retry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of your radio station invoicing"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/invoices/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Invoiced"
            value={formatCurrency(stats?.total_invoiced || 0)}
            icon={FileText}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatsCard
            title="Total Paid"
            value={formatCurrency(stats?.total_paid || 0)}
            icon={DollarSign}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatsCard
            title="Outstanding"
            value={formatCurrency(stats?.outstanding_balance || 0)}
            icon={TrendingUp}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />

          <StatsCard
            title="Total Clients"
            value={stats?.total_clients || 0}
            icon={Users}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Recent Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentInvoices
              invoices={stats?.recent_invoices || []}
              isLoading={loading}
            />
          </div>

          {/* Status Breakdown - Takes 1 column */}
          <div>
            <StatusBreakdownCard
              breakdown={stats?.status_breakdown || []}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <RecentPayments
            payments={stats?.recent_payments || []}
            isLoading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/clients')}
              fullWidth
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Clients
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/invoices')}
              fullWidth
            >
              <FileText className="h-4 w-4 mr-2" />
              View Invoices
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/payments')}
              fullWidth
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/rates')}
              fullWidth
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Rate Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;