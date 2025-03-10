import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Skeleton } from '@/components/LoadingSkeleton';

interface GeoLocation {
  country: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface ValidatorNode {
  pubkey: string;
  name: string;
  location?: GeoLocation;
  stake: number;
}

interface GlobeVisualizationProps {
  validators: ValidatorNode[];
  height?: number;
  width?: number;
  isLoading?: boolean;
  onNodeSelect?: (pubkey: string) => void;
}

export function GlobeVisualization({
  validators,
  height = 300,
  width = Dimensions.get('window').width - 40,
  isLoading = false,
  onNodeSelect,
}: GlobeVisualizationProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.title}>Global Validator Distribution</Text>
        <Skeleton height={height - 30} width={width - 32} />
      </View>
    );
  }

  // Group validators by region
  const regionCounts: Record<string, { count: number, stake: number }> = {};
  validators.forEach(validator => {
    if (validator.location) {
      const region = validator.location.country;
      if (!regionCounts[region]) {
        regionCounts[region] = { count: 0, stake: 0 };
      }
      regionCounts[region].count += 1;
      regionCounts[region].stake += validator.stake;
    }
  });

  // Sort regions by validator count
  const sortedRegions = Object.entries(regionCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([region, data]) => ({
      region,
      count: data.count,
      stake: data.stake,
    }));

  // For web, we would use a real 3D globe visualization
  // For this demo, we'll show a simplified representation
  return (
    <View style={[styles.container, { height, width }]}>
      <Text style={styles.title}>Global Validator Distribution</Text>
      
      <View style={styles.regionList}>
        {sortedRegions.map(({ region, count, stake }) => (
          <View 
            key={region} 
            style={[
              styles.regionItem,
              selectedRegion === region && styles.selectedRegion
            ]}
            onTouchStart={() => setSelectedRegion(region)}
          >
            <View style={styles.regionHeader}>
              <Text style={styles.regionName}>{region}</Text>
              <Text style={styles.regionCount}>{count} validators</Text>
            </View>
            <View style={styles.stakeBar}>
              <View 
                style={[
                  styles.stakeBarFill, 
                  { 
                    width: `${Math.min(100, (stake / 10000000) * 100)}%`,
                    backgroundColor: selectedRegion === region ? colors.primary : colors.primary + '80'
                  }
                ]} 
              />
            </View>
            <Text style={styles.stakeText}>
              {stake >= 1000000 
                ? `${(stake / 1000000).toFixed(1)}M SOL` 
                : `${(stake / 1000).toFixed(1)}K SOL`}
            </Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.disclaimer}>
        3D globe visualization available on desktop version
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  regionList: {
    flex: 1,
    gap: 12,
  },
  regionItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surfaceLight,
  },
  selectedRegion: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  regionName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  regionCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stakeBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  stakeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stakeText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});