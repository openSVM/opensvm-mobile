import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { CopyButton } from '@/components/CopyButton';
import { Wallet, Coins, ArrowRightLeft, Clock, FileText, Database, Shield, Info } from 'lucide-react-native';
import { formatAddress } from '@/utils/address-utils';
import { TeableTransactionTable } from '@/components/TeableTransactionTable';

// Mock account data
const mockAccountData = {
  address: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
  balance: 1045.75,
  tokenAccounts: [
    { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', balance: 2500.0 },
    { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', balance: 1000.0 },
  ],
  transactions: [
    { 
      signature: '5UfDuX1eEbTmDoRDpAqPGtUuQeJx5SZFuPkZY8NJTpCuJKBHYvQvK9ePU7eTKHHr3fiHhJEJEYzJUbZ5yTEsYzrS', 
      blockTime: Date.now() / 1000 - 3600, 
      type: 'Transfer',
      status: 'success',
      from: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
      to: 'FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP',
      amount: 1.5,
      fee: 0.000005,
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    },
    { 
      signature: '4XE1GxHYxaC1XELVqvDU3MQkJpQ1HKkNXCPLQkSYeKKEY4b7L3Vj9CRPUGqYgHmdGDdXtKXYgCZGxKJtNQkqXuZF', 
      blockTime: Date.now() / 1000 - 7200, 
      type: 'Swap',
      status: 'success',
      from: 'FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP',
      to: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
      amount: 2.3,
      fee: 0.000008,
      programId: 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB'
    },
    { 
      signature: '3Wz6C8WvD7HUiHCKXmfn5C8jUT7qJEkxJM9hZvCUoXvWZxcSDfqoNQmVs4YxHu8XgwJmJVLLNpBpCJM8mS8pUxbQ', 
      blockTime: Date.now() / 1000 - 10800, 
      type: 'Stake',
      status: 'success',
      from: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
      to: 'Stake11111111111111111111111111111111111111',
      amount: 10.0,
      fee: 0.000005,
      programId: 'Stake11111111111111111111111111111111111111'
    },
    { 
      signature: '2Yz7C8WvD7HUiHCKXmfn5C8jUT7qJEkxJM9hZvCUoXvWZxcSDfqoNQmVs4YxHu8XgwJmJVLLNpBpCJM8mS8pUxbQ', 
      blockTime: Date.now() / 1000 - 14400, 
      type: 'NFT Purchase',
      status: 'success',
      from: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
      to: 'Magic1111111111111111111111111111111111111',
      amount: 5.2,
      fee: 0.000012,
      programId: 'Magic1111111111111111111111111111111111111'
    },
    { 
      signature: '1Az6C8WvD7HUiHCKXmfn5C8jUT7qJEkxJM9hZvCUoXvWZxcSDfqoNQmVs4YxHu8XgwJmJVLLNpBpCJM8mS8pUxbQ', 
      blockTime: Date.now() / 1000 - 18000, 
      type: 'Deposit',
      status: 'success',
      from: 'Exchange111111111111111111111111111111111',
      to: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
      amount: 25.0,
      fee: 0.0,
      programId: 'System11111111111111111111111111111111111111'
    },
  ],
  type: 'Wallet',
  executable: false,
  rentEpoch: 361,
  lamports: 1045750000000,
  owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  data: 'Base64 encoded data...',
  programData: null
};

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'tokens', 'transactions'
  const router = useRouter();

  useEffect(() => {
    // In a real app, we would fetch the account data here
    // For now, we'll just use mock data
    setTimeout(() => {
      setAccount({
        ...mockAccountData,
        address: id as string
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(9);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading account details...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Account Details',
          headerTitleStyle: styles.headerTitle,
        }} 
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address</Text>
            <View style={styles.addressRow}>
              <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
                {account.address}
              </Text>
              <CopyButton text={account.address} />
            </View>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>SOL Balance</Text>
            <Text style={styles.balanceValue}>{account.balance.toFixed(4)} SOL</Text>
            <Text style={styles.balanceUsd}>${(account.balance * 108.75).toFixed(2)} USD</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tokens' && styles.activeTab]}
            onPress={() => setActiveTab('tokens')}
          >
            <Text style={[styles.tabText, activeTab === 'tokens' && styles.activeTabText]}>
              Tokens
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Shield size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>{account.type}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Database size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.infoLabel}>Owner</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                    {account.owner}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <FileText size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.infoLabel}>Executable</Text>
                  <Text style={styles.infoValue}>{account.executable ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Clock size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.infoLabel}>Rent Epoch</Text>
                  <Text style={styles.infoValue}>{account.rentEpoch}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Wallet size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.infoLabel}>Lamports</Text>
                  <Text style={styles.infoValue}>{account.lamports.toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.dataSection}>
                <Text style={styles.sectionTitle}>Account Data</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.dataText} numberOfLines={5} ellipsizeMode="tail">
                    {account.data}
                  </Text>
                  <TouchableOpacity style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreText}>View Full Data</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'tokens' && (
          <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Token Accounts</Text>
              
              {account.tokenAccounts.length > 0 ? (
                account.tokenAccounts.map((token: any, index: number) => (
                  <View key={index} style={styles.tokenCard}>
                    <View style={styles.tokenHeader}>
                      <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                      <Text style={styles.tokenBalance}>{token.balance.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.tokenDetails}>
                      <Text style={styles.tokenLabel}>Mint</Text>
                      <View style={styles.tokenAddressRow}>
                        <Text style={styles.tokenAddress} numberOfLines={1} ellipsizeMode="middle">
                          {token.mint}
                        </Text>
                        <CopyButton text={token.mint} size={14} />
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Info size={24} color={colors.textSecondary} />
                  <Text style={styles.emptyStateText}>No token accounts found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {activeTab === 'transactions' && (
          <View style={styles.transactionsContainer}>
            <TeableTransactionTable 
              address={account.address}
              transactions={account.transactions}
              onLoadMore={() => console.log('Load more transactions')}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontFamily: typography.mono,
    fontSize: 18,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressContainer: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  balanceContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: typography.mono,
  },
  balanceUsd: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeTabText: {
    color: colors.background,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
    maxWidth: '50%',
  },
  dataSection: {
    marginTop: 16,
  },
  dataContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dataText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: typography.mono,
  },
  viewMoreButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  tokenCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  tokenBalance: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: typography.mono,
  },
  tokenDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  tokenLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  tokenAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenAddress: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    fontFamily: typography.mono,
  },
  transactionsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});