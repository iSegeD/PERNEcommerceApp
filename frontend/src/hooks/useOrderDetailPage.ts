import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/react';
import { apiFetch } from '../lib/api';

import type { OrderResponse } from '../types';

export const useOrderDetailPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiFetch<OrderResponse>(`/api/orders/${id}`, { getToken }),
    enabled: Boolean(id),
  });

  const order = data?.order ?? null;
  const items = data?.items ?? [];
  const paid = order?.status === 'paid';

  return {
    id,
    order,
    items,
    paid,
    isLoading,
    error,
  };
};
