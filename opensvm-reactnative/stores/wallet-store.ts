import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WalletState {
  isConnected: boolean;
  address: string;
  connect: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      address: '',
      connect: () => set({ 
        isConnected: true, 
        address: '7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP' // Mock address
      }),
      disconnect: () => set({ isConnected: false, address: '' }),
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);