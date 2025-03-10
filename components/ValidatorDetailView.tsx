import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { ValidatorData } from '@/hooks/use-validator-metrics';
import { LineChart } from './charts/LineChart';
import { MetricsGrid } from './charts/MetricsGrid';
import { CopyButton } from './CopyButton';
import { ExternalLink, ChevronLeft, Shield, Award, Clock, Cpu } from 'lucide-react-native';

interface ValidatorDetailViewProps {
  validator: ValidatorData;
  onBack: () => void;
}

export function ValidatorDetailView({ validator, onBack }: ValidatorDetailViewProps) {
  const formatStake = (stake: number) => {
    if (stake >= 1000000) return `${(stake / 1000000).toFixed(2)}M SOL`;
    if (stake >= 1000) return `${(stake / 1000).toFixed(2)}K SOL`;
    return `${stake.toFixed(2)} SOL`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get the latest metrics for the metrics grid
  const latestMetrics = {
    tps: validator.performance.tps[validator.performance.tps.length - 1]?.value,
    latency: validator.performance.latency[validator.performance.latency.length - 1]?.value,
    skipRate: validator.performance.skipRate[validator.performance.skipRate.length - 1]?.value,
    blockTime: validator.performance.blockTime[validator.performance.blockTime.length - 1]?.value,
    cpu: validator.resources.cpu[validator.resources.cpu.length - 1]?.value,
    memory: validator.resources.memory[validator.resources.memory.length - 1]?.value,
    disk: validator.resources.disk[validator.resources.disk.length - 1]?.value,
    bandwidth: validator.resources.bandwidth[validator.resources.bandwidth.length - 1]?.value,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{validator.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Validator Pubkey</Text>
          <View style={styles.pubkeyContainer}>
            <Text style={styles.pubkeyText}>{validator.pubkey}</Text>
            <CopyButton text={validator.pubkey} />
            <TouchableOpacity>
              <ExternalLink size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Shield size={16} color={colors.primary} />
            <Text style={styles.statLabel}>Version</Text>
            <Text style={styles.statValue}>{validator.version}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Award size={16} color={colors.primary} />
            <Text style={styles.statLabel}>Commission</Text>
            <Text style={styles.statValue}>{validator.commission}%</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.statLabel}>Last Vote</Text>
            <Text style={styles.statValue}>{formatTime(validator.lastVote)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Cpu size={16} color={colors.primary} />
            <Text style={styles.statLabel}>Uptime</Text>
            <Text style={styles.statValue}>{validator.uptime.toFixed(2)}%</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Activated Stake</Text>
          <Text style={styles.infoValue}>{formatStake(validator.activatedStake)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: validator.delinquentStake ? colors.error + '20' : colors.success + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: validator.delinquentStake ? colors.error : colors.success }
            ]}>
              {validator.delinquentStake ? 'Delinquent' : 'Active'}
            </Text>
          </View>
        </View>

        {validator.location && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {validator.location.country}, {validator.location.region}
            </Text>
          </View>
        )}

        {validator.datacenter && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Datacenter</Text>
            <Text style={styles.infoValue}>{validator.datacenter}</Text>
          </View>
        )}
      </View>

      <MetricsGrid metrics={latestMetrics} />

      <View style={styles.chartsContainer}>
        <Text style={styles.sectionTitle}>Performance Trends</Text>
        
        <LineChart
          data={validator.performance.tps}
          title="Transactions Per Second"
          yAxisLabel="TPS"
          color={colors.primary}
        />
        
        <LineChart
          data={validator.performance.latency}
          title="Response Latency"
          yAxisLabel="ms"
          color={colors.warning}
        />
        
        <LineChart
          data={validator.performance.skipRate}
          title="Skip Rate"
          yAxisLabel="%"
          color={colors.error}
        />
        
        <LineChart
          data={validator.resources.cpu}
          title="CPU Utilization"
          yAxisLabel="%"
          color="#6366F1"
        />
        
        <LineChart
          data={validator.resources.memory}
          title="Memory Usage"
          yAxisLabel="%"
          color="#8B5CF6"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: typography.mono,
  },
  infoCard: {
    margin: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontFamily: typography.mono,
  },
  pubkeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 8,
  },
  pubkeyText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartsContainer: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
});