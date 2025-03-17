import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWalletStore } from '@/stores/wallet-store';

export function WalletButton() {
  const { isConnected, address, connect, disconnect } = useWalletStore();

  const handlePress = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isConnected ? styles.buttonConnected : null
      ]} 
      onPress={handlePress}
    >
      <Wallet size={16} color={isConnected ? colors.background : colors.primary} />
      <Text style={[
        styles.text,
        isConnected ? styles.textConnected : null
      ]}>
        {isConnected 
          ? `${address.slice(0, 4)}...${address.slice(-4)}`
          : 'Connect Wallet'
        }
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    gap: 8,
  },
  buttonConnected: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  textConnected: {
    color: colors.background,
  },
});