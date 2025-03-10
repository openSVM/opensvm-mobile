import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { ArrowRightLeft, ArrowUp, ArrowDown, Filter, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react-native';
import { formatAddress } from '@/utils/address-utils';
import { useRouter } from 'expo-router';

// Define transaction type
interface Transaction {
  signature: string;
  blockTime: number;
  type: string;
  status?: 'success' | 'error';
  from?: string;
  to?: string;
  amount?: number;
  fee?: number;
  programId?: string;
}

interface TeableTransactionTableProps {
  address: string;
  transactions?: Transaction[];
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export function TeableTransactionTable({
  address,
  transactions = [],
  isLoading = false,
  onLoadMore
}: TeableTransactionTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<'blockTime' | 'amount' | 'type'>('blockTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    time: true,
    type: true,
    amount: true,
    status: true,
    from: true,
    to: true
  });

  // Format timestamp to readable date
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format amount with appropriate symbol
  const formatAmount = (amount?: number) => {
    if (amount === undefined) return '-';
    return `${amount.toFixed(4)} SOL`;
  };

  // Sort transactions based on current sort settings
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'blockTime') {
      return sortDirection === 'asc' 
        ? a.blockTime - b.blockTime 
        : b.blockTime - a.blockTime;
    } else if (sortField === 'amount') {
      const amountA = a.amount || 0;
      const amountB = b.amount || 0;
      return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
    } else if (sortField === 'type') {
      return sortDirection === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    return 0;
  });

  // Filter transactions if a filter is applied
  const filteredTransactions = filterType
    ? sortedTransactions.filter(tx => tx.type === filterType)
    : sortedTransactions;

  // Toggle sort direction or change sort field
  const handleSort = (field: 'blockTime' | 'amount' | 'type') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Toggle filter by transaction type
  const handleFilter = (type: string) => {
    setFilterType(filterType === type ? null : type);
  };

  // Get unique transaction types for filter menu
  const transactionTypes = Array.from(new Set(transactions.map(tx => tx.type)));

  // Handle row click to expand/collapse details
  const handleRowClick = (signature: string) => {
    setExpandedRow(expandedRow === signature ? null : signature);
  };

  // Navigate to transaction details
  const handleViewTransaction = (signature: string) => {
    router.push(`/transaction/${signature}`);
  };

  // Render table header with sort controls
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {visibleColumns.time && (
        <TouchableOpacity 
          style={[styles.headerCell, styles.timeCell]} 
          onPress={() => handleSort('blockTime')}
        >
          <Text style={styles.headerText}>Time</Text>
          {sortField === 'blockTime' && (
            sortDirection === 'asc' ? 
              <ArrowUp size={14} color={colors.text} /> : 
              <ArrowDown size={14} color={colors.text} />
          )}
        </TouchableOpacity>
      )}
      
      {visibleColumns.type && (
        <TouchableOpacity 
          style={[styles.headerCell, styles.typeCell]} 
          onPress={() => handleSort('type')}
        >
          <Text style={styles.headerText}>Type</Text>
          {sortField === 'type' && (
            sortDirection === 'asc' ? 
              <ArrowUp size={14} color={colors.text} /> : 
              <ArrowDown size={14} color={colors.text} />
          )}
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterType(null)}
          >
            <Filter size={14} color={filterType ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      
      {visibleColumns.amount && (
        <TouchableOpacity 
          style={[styles.headerCell, styles.amountCell]} 
          onPress={() => handleSort('amount')}
        >
          <Text style={styles.headerText}>Amount</Text>
          {sortField === 'amount' && (
            sortDirection === 'asc' ? 
              <ArrowUp size={14} color={colors.text} /> : 
              <ArrowDown size={14} color={colors.text} />
          )}
        </TouchableOpacity>
      )}
      
      {visibleColumns.status && (
        <View style={[styles.headerCell, styles.statusCell]}>
          <Text style={styles.headerText}>Status</Text>
        </View>
      )}
    </View>
  );

  // Render a single transaction row
  const renderTransactionRow = ({ item }: { item: Transaction }) => {
    const isExpanded = expandedRow === item.signature;
    const isFromCurrentAccount = item.from === address;
    
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => handleRowClick(item.signature)}
        >
          {visibleColumns.time && (
            <View style={[styles.cell, styles.timeCell]}>
              <Clock size={14} color={colors.textSecondary} style={styles.cellIcon} />
              <Text style={styles.cellText}>{formatTime(item.blockTime)}</Text>
            </View>
          )}
          
          {visibleColumns.type && (
            <View style={[styles.cell, styles.typeCell]}>
              <ArrowRightLeft size={14} color={colors.primary} style={styles.cellIcon} />
              <Text style={styles.cellText}>{item.type}</Text>
            </View>
          )}
          
          {visibleColumns.amount && (
            <View style={[styles.cell, styles.amountCell]}>
              <DollarSign size={14} color={isFromCurrentAccount ? colors.error : colors.success} style={styles.cellIcon} />
              <Text style={[
                styles.cellText, 
                isFromCurrentAccount ? styles.outgoingAmount : styles.incomingAmount
              ]}>
                {isFromCurrentAccount ? '-' : '+'}{formatAmount(item.amount)}
              </Text>
            </View>
          )}
          
          {visibleColumns.status && (
            <View style={[styles.cell, styles.statusCell]}>
              {item.status === 'success' ? (
                <CheckCircle size={16} color={colors.success} />
              ) : item.status === 'error' ? (
                <XCircle size={16} color={colors.error} />
              ) : (
                <View style={styles.pendingDot} />
              )}
            </View>
          )}
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Signature:</Text>
              <Text style={styles.expandedValue} numberOfLines={1} ellipsizeMode="middle">
                {item.signature}
              </Text>
            </View>
            
            {visibleColumns.from && item.from && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>From:</Text>
                <Text style={styles.expandedValue} numberOfLines={1} ellipsizeMode="middle">
                  {formatAddress(item.from, 8, 8)}
                </Text>
              </View>
            )}
            
            {visibleColumns.to && item.to && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>To:</Text>
                <Text style={styles.expandedValue} numberOfLines={1} ellipsizeMode="middle">
                  {formatAddress(item.to, 8, 8)}
                </Text>
              </View>
            )}
            
            {item.fee !== undefined && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>Fee:</Text>
                <Text style={styles.expandedValue}>
                  {item.fee.toFixed(6)} SOL
                </Text>
              </View>
            )}
            
            {item.programId && (
              <View style={styles.expandedRow}>
                <Text style={styles.expandedLabel}>Program:</Text>
                <Text style={styles.expandedValue} numberOfLines={1} ellipsizeMode="middle">
                  {formatAddress(item.programId, 8, 8)}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewTransaction(item.signature)}
            >
              <Text style={styles.viewDetailsText}>View Transaction Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render filter menu
  const renderFilterMenu = () => {
    if (!filterType && transactionTypes.length === 0) return null;
    
    return (
      <View style={styles.filterMenu}>
        <Text style={styles.filterTitle}>
          {filterType ? 'Filtered by:' : 'Filter by Type:'}
        </Text>
        
        <View style={styles.filterOptions}>
          {filterType ? (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{filterType}</Text>
              <TouchableOpacity onPress={() => setFilterType(null)}>
                <XCircle size={14} color={colors.background} />
              </TouchableOpacity>
            </View>
          ) : (
            transactionTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.filterOption}
                onPress={() => handleFilter(type)}
              >
                <Text style={styles.filterOptionText}>{type}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    );
  };

  // Render column visibility controls
  const renderColumnControls = () => (
    <View style={styles.columnControls}>
      <Text style={styles.columnControlsTitle}>Columns:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.time && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, time: !visibleColumns.time})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.time && styles.columnToggleTextActive]}>
            Time
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.type && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, type: !visibleColumns.type})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.type && styles.columnToggleTextActive]}>
            Type
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.amount && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, amount: !visibleColumns.amount})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.amount && styles.columnToggleTextActive]}>
            Amount
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.status && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, status: !visibleColumns.status})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.status && styles.columnToggleTextActive]}>
            Status
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.from && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, from: !visibleColumns.from})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.from && styles.columnToggleTextActive]}>
            From
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.columnToggle, visibleColumns.to && styles.columnToggleActive]}
          onPress={() => setVisibleColumns({...visibleColumns, to: !visibleColumns.to})}
        >
          <Text style={[styles.columnToggleText, visibleColumns.to && styles.columnToggleTextActive]}>
            To
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions found</Text>
        {filterType && (
          <TouchableOpacity onPress={() => setFilterType(null)}>
            <Text style={styles.clearFilterText}>Clear filter</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderColumnControls()}
      {renderFilterMenu()}
      
      <View style={styles.tableContainer}>
        {renderHeader()}
        
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionRow}
          keyExtractor={(item) => item.signature}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      </View>
      
      <View style={styles.tableFooter}>
        <Text style={styles.footerText}>
          Showing {filteredTransactions.length} of {transactions.length} transactions
          {filterType ? ` (filtered by ${filterType})` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  clearFilterText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  columnControls: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  columnControlsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  columnToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  columnToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  columnToggleText: {
    fontSize: 12,
    color: colors.text,
  },
  columnToggleTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
  filterMenu: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionText: {
    fontSize: 12,
    color: colors.text,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
    gap: 8,
  },
  activeFilterText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '500',
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 12,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timeCell: {
    flex: 2,
    minWidth: 100,
  },
  typeCell: {
    flex: 1.5,
    minWidth: 80,
  },
  amountCell: {
    flex: 1.5,
    minWidth: 80,
  },
  statusCell: {
    width: 50,
    justifyContent: 'center',
  },
  filterButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  cell: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cellIcon: {
    marginRight: 4,
  },
  cellText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
  outgoingAmount: {
    color: colors.error,
  },
  incomingAmount: {
    color: colors.success,
  },
  pendingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.warning,
  },
  expandedContent: {
    padding: 12,
    backgroundColor: colors.surfaceLight,
    gap: 8,
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedLabel: {
    width: 80,
    fontSize: 12,
    color: colors.textSecondary,
  },
  expandedValue: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    fontFamily: typography.mono,
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '500',
  },
  tableFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});