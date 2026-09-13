import { apiFetch } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/react';

import type { MeResponse, OrdersResponse } from '../types';

export const useOrdersPage = () => {
  const { getToken, isSignedIn } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiFetch<OrdersResponse>('/api/orders', { getToken }),
    enabled: isSignedIn,
  });

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<MeResponse>('/api/me', { getToken }),
    enabled: isSignedIn,
  });

  const isStaff =
    meData?.user?.role === 'support' || meData?.user?.role === 'admin';

  const orders = data?.orders ?? [];

  return {
    isLoading,
    error,
    orders,
    isStaff,
  };
};
