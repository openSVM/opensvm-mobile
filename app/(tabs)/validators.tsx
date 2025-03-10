import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { Shield, TrendingUp, Users, Wallet, Award, Clock, Zap, Server, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useValidatorMetrics, ValidatorData } from '@/hooks/use-validator-metrics';
import { MetricsGrid } from '@/components/charts/MetricsGrid';
import { GlobeVisualization } from '@/components/charts/GlobeVisualization';
import { LineChart } from '@/components/charts/LineChart';
import { ValidatorDetailView } from '@/components/ValidatorDetailView';

function ValidatorListItem({ validator, onPress }: { validator: ValidatorData, onPress: () => void }) {
  const formatStake = (stake: number) => {
    if (stake >= 1000000) return `${(stake / 1000000).toFixed(1)}M SOL`;
    if (stake >= 1000) return `${(stake / 1000).toFixed(1)}K SOL`;
    return `${stake.toFixed(1)} SOL`;
  };

  // Get the latest TPS and latency values
  const latestTps = validator.performance.tps[validator.performance.tps.length - 1]?.value || 0;
  const latestLatency = validator.performance.latency[validator.performance.latency.length - 1]?.value || 0;

  return (
    <TouchableOpacity style={styles.validatorItem} onPress={onPress}>
      <View style={styles.validatorHeader}>
        <Text style={styles.validatorName}>{validator.name}</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: validator.delinquentStake ? colors.error : colors.success }
        ]} />
      </View>
      
      <View style={styles.validatorStats}>
        <View style={styles.validatorStat}>
          <Wallet size={14} color={colors.primary} />
          <Text style={styles.validatorStatLabel}>Stake</Text>
          <Text style={styles.validatorStatValue}>{formatStake(validator.activatedStake)}</Text>
        </View>
        
        <View style={styles.validatorStat}>
          <Zap size={14} color={colors.primary} />
          <Text style={styles.validatorStatLabel}>TPS</Text>
          <Text style={styles.validatorStatValue}>{latestTps.toLocaleString()}</Text>
        </View>
        
        <View style={styles.validatorStat}>
          <Clock size={14} color={colors.primary} />
          <Text style={styles.validatorStatLabel}>Latency</Text>
          <Text style={styles.validatorStatValue}>{latestLatency.toFixed(2)}ms</Text>
        </View>
      </View>
      
      <View style={styles.validatorFooter}>
        <Text style={styles.validatorVersion}>v{validator.version}</Text>
        {validator.location && (
          <Text style={styles.validatorLocation}>{validator.location.country}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ValidatorsScreen() {
  const {
    validators,
    isLoading,
    selectedValidator,
    setSelectedValidator,
    getValidator,
    getTopValidators,
    getAverageMetrics,
  } = useValidatorMetrics();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you would refresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const selectedValidatorData = selectedValidator ? getValidator(selectedValidator) : null;
  const topValidators = getTopValidators(5);
  const avgMetrics = getAverageMetrics();
  
  // Filter validators based on search query
  const filteredValidators = searchQuery
    ? validators.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.pubkey.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : validators;

  if (selectedValidatorData) {
    return (
      <ValidatorDetailView 
        validator={selectedValidatorData} 
        onBack={() => setSelectedValidator(null)} 
      />
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Validator Network</Text>
        <Text style={styles.subtitle}>
          Firedancer Performance Metrics
        </Text>
      </View>

      {/* Network Overview */}
      {avgMetrics && (
        <MetricsGrid 
          metrics={{
            tps: avgMetrics.tps,
            latency: avgMetrics.latency,
            skipRate: avgMetrics.skipRate,
          }}
          isLoading={isLoading}
        />
      )}

      {/* Global Distribution */}
      <View style={styles.section}>
        <GlobeVisualization 
          validators={validators.map(v => ({
            pubkey: v.pubkey,
            name: v.name,
            location: v.location,
            stake: v.activatedStake,
          }))}
          isLoading={isLoading}
          onNodeSelect={(pubkey) => setSelectedValidator(pubkey)}
        />
      </View>

      {/* Performance Charts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Performance</Text>
        
        {topValidators[0] && (
          <LineChart
            data={topValidators[0].performance.tps}
            title="Transactions Per Second"
            color={colors.primary}
            isLoading={isLoading}
          />
        )}
        
        {topValidators[0] && (
          <LineChart
            data={topValidators[0].performance.latency}
            title="Response Latency"
            color={colors.warning}
            isLoading={isLoading}
          />
        )}
      </View>

      {/* Top Validators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Validators</Text>
        
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.textSecondary} />
          <TouchableOpacity 
            style={styles.searchInput}
            onPress={() => {/* Open search modal */}}
          >
            <Text style={styles.searchPlaceholder}>Search validators...</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.validatorsList}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <View key={i} style={[styles.validatorItem, styles.validatorItemLoading]} />
            ))
          ) : (
            filteredValidators.slice(0, 10).map((validator) => (
              <ValidatorListItem
                key={validator.pubkey}
                validator={validator}
                onPress={() => setSelectedValidator(validator.pubkey)}
              />
            ))
          )}
        </View>
        
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Validators</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: typography.mono,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  validatorsList: {
    gap: 12,
  },
  validatorItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  validatorItemLoading: {
    height: 120,
    opacity: 0.5,
  },
  validatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  validatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  validatorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  validatorStat: {
    alignItems: 'center',
  },
  validatorStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  validatorStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    fontFamily: typography.mono,
  },
  validatorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  validatorVersion: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  validatorLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewAllButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});