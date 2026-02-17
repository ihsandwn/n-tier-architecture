import useSWR from 'swr';
import { api } from '@/lib/api';
import { InventoryLevel, Warehouse } from '@/lib/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useInventory() {
  const { data, error, isLoading, mutate } = useSWR<InventoryLevel[]>(
    '/inventory',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    inventory: data || [],
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}

export function useWarehouses() {
  const { data, error, isLoading, mutate } = useSWR<Warehouse[]>(
    '/warehouses',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    warehouses: data || [],
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}

export function useWarehouse(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Warehouse>(
    id ? `/warehouses/${id}` : null,
    fetcher
  );

  return {
    warehouse: data,
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}
