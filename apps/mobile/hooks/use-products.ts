import useSWR from 'swr';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    '/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    products: data || [],
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}

export function useProduct(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/products/${id}` : null,
    fetcher
  );

  return {
    product: data,
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}
