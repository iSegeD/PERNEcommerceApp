import { useAuth } from '@clerk/react';
import { useQuery } from '@tanstack/react-query';

import { useCart } from '../store/cart';

import { apiFetch } from '../lib/api';

import type { ProductsResponse, CheckoutResponse } from '../types';

import { useState } from 'react';

export const useCartPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { getToken } = useAuth();

  const items = useCart((state) => state.items);
  const setQuantity = useCart((state) => state.setQuantity);
  const removeItem = useCart((state) => state.removeItem);

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<ProductsResponse>('/api/products'),
    enabled: items.length > 0,
  });

  const products = data?.products ?? [];

  const productsIds = new Map(products.map((item) => [item.id, item]));

  const lines = items.map((line) => ({
    line,
    product: productsIds.get(line.productId) ?? null,
  }));

  const subtotal = lines.reduce((sum, { line, product: p }) => {
    if (!p) return sum;

    return sum + p.priceCents * line.quantity;
  }, 0);

  const checkOut = async () => {
    setCheckoutLoading(true);

    const body = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const res = await apiFetch<CheckoutResponse>('/api/checkout', {
      getToken,
      method: 'POST',
      body,
    });

    if (res?.checkoutUrl) {
      window.location.href = res.checkoutUrl;
      return;
    }

    setCheckoutLoading(false);
  };

  return {
    items,
    setQuantity,
    removeItem,
    productsLoading,
    productsError,
    lines,
    subtotal,
    checkOut,
    checkoutLoading,
  };
};
