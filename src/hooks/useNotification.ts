// ============================================
// Notification Hook (Toast)
// ============================================

import { useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseNotificationReturn {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id: string) => void;
}

/**
 * Hook for showing toast notifications
 */
export function useNotification(): UseNotificationReturn {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  }, []);

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  }, []);

  const info = useCallback((message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
    });
  }, []);

  const warning = useCallback((message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
    });
  }, []);

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  };
}