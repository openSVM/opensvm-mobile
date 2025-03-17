import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ArrowRightLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Transaction } from '@/types/blockchain';
import { useRouter } from 'expo-router';
import { CopyButton } from './CopyButton';
import { Skeleton } from './LoadingSkeleton';

interface TransactionListProps {
  transactions: Transaction[];
  onLoadMore: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

function TransactionSkeleton() {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionHeader}>
        <View style={styles.typeContainer}>
          <Skeleton width={100} height={20} />
        </View>
        <Skeleton width={20} height={20} borderRadius={10} />
      </View>

      <View style={styles.addresses}>
        <Text style={styles.addressLabel}>From</Text>
        <View style={styles.addressRow}>
          <Skeleton width={120} height={20} />
        </View>
        <Text style={styles.addressLabel}>To</Text>
        <View style={styles.addressRow}>
          <Skeleton width={120} height={20} />
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <Skeleton width={80} height={16} />
        <Skeleton width={100} height={16} />
      </View>
    </View>
  );
}

export function TransactionList({ 
  transactions,
  onLoadMore,
  refreshing,
  onRefresh,
  isLoading
}: TransactionListProps) {
  const router = useRouter();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transaction}
      onPress={() => router.push(`/transaction/${item.signature}`)}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.typeContainer}>
          <ArrowRightLeft size={16} color={colors.primary} />
          <Text style={styles.type}>{item.type}</Text>
        </View>
        {item.status === 'success' ? (
          <CheckCircle2 size={16} color={colors.success} />
        ) : (
          <XCircle size={16} color={colors.error} />
        )}
      </View>

      <View style={styles.addresses}>
        <Text style={styles.addressLabel}>From</Text>
        <View style={styles.addressRow}>
          <Text style={styles.address}>{formatAddress(item.from)}</Text>
          <CopyButton text={item.from} />
        </View>
        <Text style={styles.addressLabel}>To</Text>
        <View style={styles.addressRow}>
          <Text style={styles.address}>{formatAddress(item.to)}</Text>
          <CopyButton text={item.to} />
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        <Text style={styles.amount}>{item.amount} SOL</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.list}>
        {[1, 2, 3].map((key) => (
          <React.Fragment key={key}>
            <TransactionSkeleton />
            <View style={styles.separator} />
          </React.Fragment>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.signature}
      contentContainerStyle={styles.list}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  transaction: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  type: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  addresses: {
    gap: 4,
  },
  addressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  amount: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
});