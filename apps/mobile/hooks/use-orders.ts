import useSWR from 'swr';
import { api } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useOrders(status?: OrderStatus) {
  const params = status ? `?status=${status}` : '';
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    `/orders${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    orders: data || [],
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}

export function useOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Order>(
    id ? `/orders/${id}` : null,
    fetcher
  );

  return {
    order: data,
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}

export async function createOrder(items: Record<string, any>[]) {
  const response = await api.post('/orders', { items });
  return response.data;
}
