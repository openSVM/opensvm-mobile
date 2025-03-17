import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Skeleton } from './LoadingSkeleton';

interface StatsCardProps {
  value: string | number;
  label: string;
  isLoading?: boolean;
}

function StatsCard({ value, label, isLoading }: StatsCardProps) {
  const { width } = useWindowDimensions();
  const isSmall = width < 375;

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Skeleton height={20} width={100} />
        <Skeleton height={14} width={80} style={{ marginTop: 4 }} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text 
        style={[styles.value, isSmall && styles.valueSmall]} 
        numberOfLines={1} 
        minimumFontScale={0.5}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[styles.label, isSmall && styles.labelSmall]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

interface NetworkStatsProps {
  blocksProcessed: number;
  activeValidators: number;
  tps: number;
  epoch: number;
  networkLoad: number;
  blockHeight: number;
  isLoading?: boolean;
}

export function NetworkStats({
  blocksProcessed,
  activeValidators,
  tps,
  epoch,
  networkLoad,
  blockHeight,
  isLoading = false,
}: NetworkStatsProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topStats}>
        <StatsCard 
          value={formatNumber(blocksProcessed)} 
          label="Blocks Processed" 
          isLoading={isLoading}
        />
        <StatsCard 
          value={formatNumber(activeValidators)} 
          label="Active Validators" 
          isLoading={isLoading}
        />
        <StatsCard 
          value={formatNumber(tps)} 
          label="TPS" 
          isLoading={isLoading}
        />
      </View>
      
      <View style={styles.bottomStats}>
        {isLoading ? (
          <>
            <View style={styles.statRow}>
              <Skeleton height={16} width={100} />
              <Skeleton height={16} width={60} />
            </View>
            <View style={styles.statRow}>
              <Skeleton height={16} width={100} />
              <Skeleton height={16} width={60} />
            </View>
            <View style={styles.statRow}>
              <Skeleton height={16} width={100} />
              <Skeleton height={16} width={60} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current Epoch</Text>
              <Text style={styles.statValue}>{epoch}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Network Load</Text>
              <Text style={styles.statValue}>{networkLoad.toFixed(2)}%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Block Height</Text>
              <Text style={styles.statValue}>{formatNumber(blockHeight)}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  topStats: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
  },
  value: {
    fontFamily: typography.mono,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  valueSmall: {
    fontSize: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
  },
  bottomStats: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: typography.mono,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
});