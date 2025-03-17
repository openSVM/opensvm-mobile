import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Skeleton } from './LoadingSkeleton';

interface Block {
  number: number;
}

interface RecentBlocksProps {
  blocks: Block[];
  onBlockPress: (block: Block) => void;
  isLoading?: boolean;
}

function BlockSkeleton() {
  return (
    <View style={styles.blockItem}>
      <Skeleton width={120} height={20} />
      <Skeleton width={20} height={20} />
    </View>
  );
}

export function RecentBlocks({ blocks, onBlockPress, isLoading }: RecentBlocksProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Blocks</Text>
        <View style={styles.list}>
          {[1, 2, 3, 4, 5].map((key) => (
            <BlockSkeleton key={key} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Blocks</Text>
      <View style={styles.list}>
        {blocks.map((block) => (
          <TouchableOpacity
            key={block.number}
            style={styles.blockItem}
            onPress={() => onBlockPress(block)}
          >
            <Text style={styles.blockNumber}>Block #{block.number}</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: 16,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockNumber: {
    fontFamily: typography.mono,
    fontSize: typography.size.base,
    color: colors.text,
  },
});