export interface Transaction {
  signature: string;
  slot: number;
  timestamp: number;
  fee: number;
  status: 'success' | 'error';
  from: string;
  to: string;
  amount: number;
  type: string;
}

export interface Token {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
}

export interface MarketStats {
  solPrice: number;
  solPriceChange24h: number;
  marketCap: number;
  volume24h: number;
  transactions24h: number;
}