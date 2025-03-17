import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useWalletStore } from '@/stores/wallet-store';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Wallet, Copy, ExternalLink } from 'lucide-react-native';
import { CopyButton } from '@/components/CopyButton';

export default function WalletScreen() {
  const { isConnected, address, connect } = useWalletStore();

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Wallet size={48} color={colors.primary} />
          <Text style={styles.title}>Connect Wallet</Text>
          <Text style={styles.description}>
            Connect your wallet to view your assets, transactions, and more.
          </Text>
          <TouchableOpacity style={styles.button} onPress={connect}>
            <Text style={styles.buttonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Wallet</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{address}</Text>
          <CopyButton text={address} />
          <TouchableOpacity>
            <ExternalLink size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.mono,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.mono,
  },
});