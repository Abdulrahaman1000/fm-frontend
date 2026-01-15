// ============================================
// Rate Card Types
// ============================================

export interface Rate {
  id: string;
  category: string;
  duration?: string;
  time_slot?: string;
  platform?: string;
  price: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRateData {
  category: string;
  duration?: string;
  time_slot?: string;
  platform?: string;
  price: number;
  description?: string;
}

export interface UpdateRateData {
  category?: string;
  duration?: string;
  time_slot?: string;
  platform?: string;
  price?: number;
  description?: string;
}

export interface RateFilters {
  category?: string;
}