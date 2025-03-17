import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './use-websocket';

// Mock WebSocket URL - in a real app, this would be your actual WebSocket endpoint
const WEBSOCKET_URL = 'wss://api.opensvm.com/validators/metrics';

export interface ValidatorMetric {
  timestamp: number;
  value: number;
}

export interface ValidatorPerformance {
  tps: ValidatorMetric[];
  latency: ValidatorMetric[];
  blockTime: ValidatorMetric[];
  skipRate: ValidatorMetric[];
  voteDistance: ValidatorMetric[];
  slotProcessingTime: ValidatorMetric[];
}

export interface ValidatorResource {
  cpu: ValidatorMetric[];
  memory: ValidatorMetric[];
  disk: ValidatorMetric[];
  bandwidth: ValidatorMetric[];
}

export interface ValidatorData {
  pubkey: string;
  name: string;
  version: string;
  performance: ValidatorPerformance;
  resources: ValidatorResource;
  uptime: number;
  lastVote: number;
  commission: number;
  activatedStake: number;
  delinquentStake: boolean;
  location?: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  datacenter?: string;
}

// Initial mock data
const generateMockMetrics = (count: number, min: number, max: number): ValidatorMetric[] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * 60000,
    value: min + Math.random() * (max - min)
  }));
};

const createMockValidator = (pubkey: string, name: string): ValidatorData => ({
  pubkey,
  name,
  version: `1.14.${Math.floor(Math.random() * 20)}`,
  performance: {
    tps: generateMockMetrics(60, 1000, 5000),
    latency: generateMockMetrics(60, 0.05, 0.5),
    blockTime: generateMockMetrics(60, 0.4, 0.6),
    skipRate: generateMockMetrics(60, 0, 0.05),
    voteDistance: generateMockMetrics(60, 0, 12),
    slotProcessingTime: generateMockMetrics(60, 0.1, 0.3),
  },
  resources: {
    cpu: generateMockMetrics(60, 10, 90),
    memory: generateMockMetrics(60, 20, 80),
    disk: generateMockMetrics(60, 30, 70),
    bandwidth: generateMockMetrics(60, 100, 1000),
  },
  uptime: 99.8 + Math.random() * 0.2,
  lastVote: Date.now() - Math.floor(Math.random() * 10000),
  commission: Math.floor(Math.random() * 10),
  activatedStake: Math.floor(1000000 + Math.random() * 9000000),
  delinquentStake: Math.random() > 0.95,
  location: {
    country: ['USA', 'Germany', 'Japan', 'Singapore', 'Canada'][Math.floor(Math.random() * 5)],
    region: ['East', 'West', 'Central', 'North', 'South'][Math.floor(Math.random() * 5)],
    coordinates: [
      Math.random() * 360 - 180, // longitude
      Math.random() * 180 - 90,  // latitude
    ],
  },
  datacenter: ['AWS', 'GCP', 'Azure', 'Hetzner', 'OVH'][Math.floor(Math.random() * 5)],
});

// Generate initial mock validators
const initialValidators: ValidatorData[] = [
  createMockValidator('FD1', 'Firedancer Main'),
  createMockValidator('FD2', 'Firedancer Backup'),
  createMockValidator('SL1', 'Solana Labs 1'),
  createMockValidator('SL2', 'Solana Labs 2'),
  createMockValidator('JT1', 'Jump Trading'),
  createMockValidator('BN1', 'Binance Node'),
  createMockValidator('CB1', 'Coinbase Validator'),
  createMockValidator('KR1', 'Kraken Validator'),
  createMockValidator('FTX', 'FTX Validator'),
  createMockValidator('GEM', 'Gemini Node'),
];

export function useValidatorMetrics() {
  const [validators, setValidators] = useState<ValidatorData[]>(initialValidators);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<string | null>(null);

  // In a real app, we would connect to a real WebSocket
  // For this demo, we'll simulate WebSocket updates
  const { lastMessage, isConnected } = useWebSocket({
    url: WEBSOCKET_URL,
    autoConnect: false, // We'll simulate instead
    onMessage: (event) => {
      // Handle real WebSocket messages here
    },
  });

  // Simulate WebSocket updates
  useEffect(() => {
    const interval = setInterval(() => {
      setValidators(prevValidators => 
        prevValidators.map(validator => {
          // Update TPS with a new data point
          const newTps = [...validator.performance.tps];
          newTps.shift(); // Remove oldest
          newTps.push({
            timestamp: Date.now(),
            value: Math.max(1000, newTps[newTps.length - 1].value + (Math.random() * 200 - 100))
          });
          
          // Update latency with a new data point
          const newLatency = [...validator.performance.latency];
          newLatency.shift();
          newLatency.push({
            timestamp: Date.now(),
            value: Math.max(0.05, Math.min(0.5, newLatency[newLatency.length - 1].value + (Math.random() * 0.05 - 0.025)))
          });
          
          // Update CPU usage
          const newCpu = [...validator.resources.cpu];
          newCpu.shift();
          newCpu.push({
            timestamp: Date.now(),
            value: Math.max(10, Math.min(95, newCpu[newCpu.length - 1].value + (Math.random() * 10 - 5)))
          });
          
          return {
            ...validator,
            performance: {
              ...validator.performance,
              tps: newTps,
              latency: newLatency,
            },
            resources: {
              ...validator.resources,
              cpu: newCpu,
            },
            lastVote: Date.now() - Math.floor(Math.random() * 5000),
          };
        })
      );
    }, 5000);
    
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getValidator = useCallback((pubkey: string) => {
    return validators.find(v => v.pubkey === pubkey) || null;
  }, [validators]);

  const getTopValidators = useCallback((count: number = 5) => {
    return [...validators]
      .sort((a, b) => b.activatedStake - a.activatedStake)
      .slice(0, count);
  }, [validators]);

  const getValidatorsByDatacenter = useCallback(() => {
    const datacenters: Record<string, number> = {};
    validators.forEach(validator => {
      const dc = validator.datacenter || 'Unknown';
      datacenters[dc] = (datacenters[dc] || 0) + 1;
    });
    return datacenters;
  }, [validators]);

  const getValidatorsByRegion = useCallback(() => {
    const regions: Record<string, number> = {};
    validators.forEach(validator => {
      if (validator.location) {
        const region = validator.location.country;
        regions[region] = (regions[region] || 0) + 1;
      }
    });
    return regions;
  }, [validators]);

  const getAverageMetrics = useCallback(() => {
    if (validators.length === 0) return null;
    
    const avgTps = validators.reduce((sum, v) => {
      const lastTps = v.performance.tps[v.performance.tps.length - 1]?.value || 0;
      return sum + lastTps;
    }, 0) / validators.length;
    
    const avgLatency = validators.reduce((sum, v) => {
      const lastLatency = v.performance.latency[v.performance.latency.length - 1]?.value || 0;
      return sum + lastLatency;
    }, 0) / validators.length;
    
    const avgSkipRate = validators.reduce((sum, v) => {
      const lastSkipRate = v.performance.skipRate[v.performance.skipRate.length - 1]?.value || 0;
      return sum + lastSkipRate;
    }, 0) / validators.length;
    
    return {
      tps: avgTps,
      latency: avgLatency,
      skipRate: avgSkipRate,
      uptime: validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length,
    };
  }, [validators]);

  return {
    validators,
    isLoading,
    error,
    isConnected,
    selectedValidator,
    setSelectedValidator,
    getValidator,
    getTopValidators,
    getValidatorsByDatacenter,
    getValidatorsByRegion,
    getAverageMetrics,
  };
}