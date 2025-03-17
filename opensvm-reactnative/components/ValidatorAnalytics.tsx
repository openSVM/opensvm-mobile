import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Shield, Globe, Users, Wallet, TrendingUp, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';

interface ValidatorStats {
  totalStake: number;
  averageStake: number;
  activeValidators: number;
  totalDelegators: number;
  averageAPY: number;
  regions: {
    name: string;
    validators: number;
    stake: number;
  }[];
}

const mockStats: ValidatorStats = {
  totalStake: 354829481,
  averageStake: 258234,
  activeValidators: 1388,
  totalDelegators: 892341,
  averageAPY: 6.8,
  regions: [
    { name: 'North America', validators: 482, stake: 124893241 },
    { name: 'Europe', validators: 394, stake: 98234123 },
    { name: 'Asia', validators: 289, stake: 76234123 },
    { name: 'South America', validators: 123, stake: 34123412 },
    { name: 'Africa', validators: 67, stake: 12341234 },
    { name: 'Oceania', validators: 33, stake: 8923412 },
  ]
};

function StatsCard({ icon: Icon, label, value, subvalue }: any) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Icon size={18} color={colors.primary} />
        <Text style={styles.statsLabel}>{label}</Text>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      {subvalue && (
        <Text style={styles.statsSubvalue}>{subvalue}</Text>
      )}
    </View>
  );
}

function RegionGlobe() {
  const { width } = useWindowDimensions();
  const regions = mockStats.regions;
  const maxValidators = Math.max(...regions.map(r => r.validators));

  return (
    <View style={styles.globeContainer}>
      <View style={styles.globeHeader}>
        <Text style={styles.globeTitle}>Global Distribution</Text>
        <TouchableOpacity style={styles.globeButton}>
          <Text style={styles.globeButtonText}>View All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionsContainer}
      >
        {regions.map((region, index) => {
          const percentage = (region.validators / maxValidators) * 100;
          return (
            <View key={region.name} style={styles.regionCard}>
              <LinearGradient
                colors={[colors.primary + '20', colors.primary + '05']}
                style={[styles.regionBar, { height: `${percentage}%` }]}
              />
              <Text style={styles.regionValue}>{region.validators}</Text>
              <Text style={styles.regionName}>{region.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function ValidatorAnalytics() {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <StatsCard
          icon={Shield}
          label="Active Validators"
          value={formatNumber(mockStats.activeValidators)}
          subvalue="+12% this month"
        />
        <StatsCard
          icon={Wallet}
          label="Total Stake"
          value={`${formatNumber(mockStats.totalStake)} SOL`}
          subvalue={`≈ $${formatNumber(mockStats.totalStake * 108)}`}
        />
        <StatsCard
          icon={Users}
          label="Total Delegators"
          value={formatNumber(mockStats.totalDelegators)}
        />
        <StatsCard
          icon={TrendingUp}
          label="Average APY"
          value={`${mockStats.averageAPY}%`}
          subvalue="Last 30 days"
        />
      </View>

      <RegionGlobe />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontFamily: typography.mono,
  },
  statsSubvalue: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  globeContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  globeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  globeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  globeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  globeButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  regionsContainer: {
    height: 200,
    gap: 16,
    paddingRight: 16,
  },
  regionCard: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
    height: '100%',
  },
  regionBar: {
    width: '100%',
    borderRadius: 8,
    position: 'absolute',
    bottom: 40,
  },
  regionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  regionName: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});