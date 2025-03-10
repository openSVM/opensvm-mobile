import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Skeleton } from '@/components/LoadingSkeleton';
import { Zap, Clock, Server, Award, Cpu, HardDrive, Wifi } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  color?: string;
}

function MetricCard({ title, value, subtitle, icon, isLoading, color = colors.primary }: MetricCardProps) {
  if (isLoading) {
    return (
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          {icon}
          <Skeleton width={80} height={16} />
        </View>
        <Skeleton width={100} height={24} style={{ marginVertical: 8 }} />
        {subtitle && <Skeleton width={120} height={14} />}
      </View>
    );
  }

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        {icon}
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );
}

interface MetricsGridProps {
  metrics: {
    tps?: number;
    latency?: number;
    skipRate?: number;
    blockTime?: number;
    cpu?: number;
    memory?: number;
    disk?: number;
    bandwidth?: number;
  };
  isLoading?: boolean;
}

export function MetricsGrid({ metrics, isLoading = false }: MetricsGridProps) {
  const formatValue = (value: number | undefined, format: string) => {
    if (value === undefined) return 'N/A';
    
    switch (format) {
      case 'percent':
        return `${(value * 100).toFixed(2)}%`;
      case 'ms':
        return `${value.toFixed(2)}ms`;
      case 'seconds':
        return `${value.toFixed(2)}s`;
      case 'tps':
        return value.toLocaleString();
      case 'mbps':
        return `${value.toFixed(1)} Mbps`;
      default:
        return value.toString();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Metrics</Text>
      
      <View style={styles.grid}>
        <MetricCard
          title="TPS"
          value={formatValue(metrics.tps, 'tps')}
          subtitle="Transactions per second"
          icon={<Zap size={20} color={colors.primary} />}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Latency"
          value={formatValue(metrics.latency, 'ms')}
          subtitle="Average response time"
          icon={<Clock size={20} color={colors.warning} />}
          isLoading={isLoading}
          color={colors.warning}
        />
        
        <MetricCard
          title="Skip Rate"
          value={formatValue(metrics.skipRate, 'percent')}
          subtitle="Missed blocks"
          icon={<Award size={20} color={metrics.skipRate && metrics.skipRate > 0.01 ? colors.error : colors.success} />}
          isLoading={isLoading}
          color={metrics.skipRate && metrics.skipRate > 0.01 ? colors.error : colors.success}
        />
        
        <MetricCard
          title="Block Time"
          value={formatValue(metrics.blockTime, 'seconds')}
          subtitle="Average time per block"
          icon={<Server size={20} color={colors.primary} />}
          isLoading={isLoading}
        />
      </View>
      
      <Text style={[styles.title, { marginTop: 24 }]}>Resource Utilization</Text>
      
      <View style={styles.grid}>
        <MetricCard
          title="CPU"
          value={formatValue(metrics.cpu, 'percent')}
          subtitle="Processor usage"
          icon={<Cpu size={20} color={metrics.cpu && metrics.cpu > 80 ? colors.error : colors.primary} />}
          isLoading={isLoading}
          color={metrics.cpu && metrics.cpu > 80 ? colors.error : colors.primary}
        />
        
        <MetricCard
          title="Memory"
          value={formatValue(metrics.memory, 'percent')}
          subtitle="RAM utilization"
          icon={<Server size={20} color={metrics.memory && metrics.memory > 80 ? colors.warning : colors.primary} />}
          isLoading={isLoading}
          color={metrics.memory && metrics.memory > 80 ? colors.warning : colors.primary}
        />
        
        <MetricCard
          title="Disk"
          value={formatValue(metrics.disk, 'percent')}
          subtitle="Storage usage"
          icon={<HardDrive size={20} color={colors.primary} />}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Network"
          value={formatValue(metrics.bandwidth, 'mbps')}
          subtitle="Bandwidth usage"
          icon={<Wifi size={20} color={colors.primary} />}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontFamily: typography.mono,
  },
  metricSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
});