import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from '@/components/SearchBar';
import { NetworkStats } from '@/components/NetworkStats';
import { ValidatorAnalytics } from '@/components/ValidatorAnalytics';
import { AIAssistant } from '@/components/AIAssistant';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

// Mock data
const mockStats = {
  blocksProcessed: 323139497,
  activeValidators: 1388,
  tps: 4108,
  epoch: 748,
  networkLoad: 0.81,
  blockHeight: 323139497,
};

// Mock recent blocks
const mockRecentBlocks = [
  { number: 323139497 },
  { number: 323139496 },
  { number: 323139495 },
  { number: 323139494 },
  { number: 323139493 },
];

export default function ExplorerScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    
    // Simulate search results
    if (query.trim()) {
      // For demo purposes, just show some mock results
      setSearchResults([
        { type: 'transaction', id: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP', title: 'Transaction' },
        { type: 'block', id: '323139497', title: 'Block #323139497' },
        { type: 'account', id: 'FD1', title: 'Firedancer Main' },
      ]);
    } else {
      setSearchResults(null);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSearchResults(null);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const handleBlockPress = (block: any) => {
    console.log(`Navigating to block ${block.number}`);
    // router.push(`/block/${block.number}`);
  };

  const handleSearchResultPress = (result: any) => {
    if (result.type === 'transaction') {
      router.push(`/transaction/${result.id}`);
    } else if (result.type === 'block') {
      console.log(`Navigating to block ${result.id}`);
      // router.push(`/block/${result.id}`);
    } else if (result.type === 'account') {
      console.log(`Navigating to account ${result.id}`);
      // router.push(`/account/${result.id}`);
    }
    setSearchResults(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <SearchBar onSearch={handleSearch} />
        
        {searchResults ? (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>Search Results</Text>
            {searchResults.map((result, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.searchResultItem}
                onPress={() => handleSearchResultPress(result)}
              >
                <Text style={styles.searchResultType}>{result.title}</Text>
                <Text style={styles.searchResultId}>{result.id}</Text>
                <ChevronRight size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <NetworkStats {...mockStats} isLoading={isLoading} />
            <ValidatorAnalytics />
            
            <View style={styles.recentBlocks}>
              <Text style={styles.sectionTitle}>Recent Blocks</Text>
              {mockRecentBlocks.map((block) => (
                <TouchableOpacity
                  key={block.number}
                  style={styles.blockItem}
                  onPress={() => handleBlockPress(block)}
                >
                  <Text style={styles.blockNumber}>Block #{block.number}</Text>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <AIAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchResults: {
    padding: 16,
    backgroundColor: colors.background,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchResultType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  searchResultId: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  recentBlocks: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockNumber: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'monospace',
  },
});