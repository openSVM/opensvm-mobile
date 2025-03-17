import { useState, useEffect } from 'react';

export function useNetworkStats() {
  const [stats, setStats] = useState({
    blocksProcessed: 0,
    activeValidators: 0,
    tps: 0,
    epoch: 0,
    networkLoad: 0,
    blockHeight: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStats({
        blocksProcessed: 323139497,
        activeValidators: 1388,
        tps: 4108,
        epoch: 748,
        networkLoad: 0.81,
        blockHeight: 323139497,
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refresh = () => {
    return fetchStats();
  };

  return {
    stats,
    isLoading,
    error,
    refresh,
  };
}