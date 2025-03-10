import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { CopyButton } from '@/components/CopyButton';
import { ArrowRightLeft, CheckCircle, XCircle, Clock, DollarSign, FileText } from 'lucide-react-native';

// Mock transaction data
const mockTransaction = {
  signature: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
  slot: 323139497,
  timestamp: Date.now() / 1000 - 3600, // 1 hour ago
  fee: 0.000005,
  status: 'success',
  from: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP',
  to: 'FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP',
  amount: 1.5,
  type: 'Transfer',
  programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  logs: [
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
    'Program log: Transfer 1.5 SOL',
    'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success'
  ]
};

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we would fetch the transaction data here
    // For now, we'll just use mock data
    setTimeout(() => {
      setTransaction({
        ...mockTransaction,
        signature: id as string
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading transaction details...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Transaction Details',
          headerTitleStyle: styles.headerTitle,
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <ArrowRightLeft size={20} color={colors.primary} />
            <Text style={styles.transactionType}>{transaction.type}</Text>
            {transaction.status === 'success' ? (
              <View style={[styles.statusBadge, styles.successBadge]}>
                <CheckCircle size={14} color={colors.success} />
                <Text style={[styles.statusText, styles.successText]}>Success</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.errorBadge]}>
                <XCircle size={14} color={colors.error} />
                <Text style={[styles.statusText, styles.errorText]}>Failed</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                {transaction.signature}
              </Text>
              <CopyButton text={transaction.signature} />
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timestamp</Text>
            <Text style={styles.infoValue}>{formatTime(transaction.timestamp)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Slot</Text>
            <Text style={styles.infoValue}>{transaction.slot.toLocaleString()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fee</Text>
            <Text style={styles.infoValue}>{transaction.fee} SOL</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>From</Text>
            <TouchableOpacity 
              style={styles.addressContainer}
              onPress={() => console.log(`Navigate to account ${transaction.from}`)}
            >
              <Text style={styles.addressText}>{formatAddress(transaction.from)}</Text>
              <CopyButton text={transaction.from} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.arrow}>
            <ArrowRightLeft size={20} color={colors.textSecondary} />
          </View>
          
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>To</Text>
            <TouchableOpacity 
              style={styles.addressContainer}
              onPress={() => console.log(`Navigate to account ${transaction.to}`)}
            >
              <Text style={styles.addressText}>{formatAddress(transaction.to)}</Text>
              <CopyButton text={transaction.to} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{transaction.amount} SOL</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program</Text>
          <TouchableOpacity 
            style={styles.programContainer}
            onPress={() => console.log(`Navigate to program ${transaction.programId}`)}
          >
            <Text style={styles.programText}>{formatAddress(transaction.programId)}</Text>
            <CopyButton text={transaction.programId} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logs</Text>
          <View style={styles.logsContainer}>
            {transaction.logs.map((log: string, index: number) => (
              <Text key={index} style={styles.logText}>{log}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: typography.mono,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  successBadge: {
    backgroundColor: colors.success + '20',
  },
  errorBadge: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.error,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '70%',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  addressSection: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  arrow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: typography.mono,
  },
  programContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  programText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  logsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: typography.mono,
    marginBottom: 4,
  }
});