import useSWR from 'swr';
import { api } from '@/lib/api';
import { DashboardMetrics } from '@/lib/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardMetrics>(
    '/analytics/dashboard',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    metrics: data,
    isLoading,
    error,
    isError: !!error,
    mutate,
  };
}
