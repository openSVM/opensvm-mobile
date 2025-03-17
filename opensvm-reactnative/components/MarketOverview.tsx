import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Coins, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MarketStats } from '@/types/blockchain';

interface MarketOverviewProps {
  stats: MarketStats;
}

export function MarketOverview({ stats }: MarketOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>SOL Price</Text>
        <Text style={styles.price}>${stats.solPrice.toFixed(2)}</Text>
        <View style={[
          styles.changeContainer,
          { backgroundColor: stats.solPriceChange24h >= 0 ? colors.success + '20' : colors.error + '20' }
        ]}>
          {stats.solPriceChange24h >= 0 ? (
            <TrendingUp size={16} color={colors.success} />
          ) : (
            <TrendingDown size={16} color={colors.error} />
          )}
          <Text style={[
            styles.changeText,
            { color: stats.solPriceChange24h >= 0 ? colors.success : colors.error }
          ]}>
            {formatChange(stats.solPriceChange24h)}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Coins size={20} color={colors.primaryLight} />
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>{formatNumber(stats.marketCap)}</Text>
        </View>
        <View style={styles.statItem}>
          <BarChart3 size={20} color={colors.secondaryLight} />
          <Text style={styles.statLabel}>24h Volume</Text>
          <Text style={styles.statValue}>{formatNumber(stats.volume24h)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});