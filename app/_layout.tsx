import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { colors } from '@/constants/colors';
import { ShaderBackground } from '@/components/ShaderBackground';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ShaderBackground />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="transaction/[id]" 
          options={{ 
            title: 'Transaction Details',
            presentation: 'card',
          }} 
        />
      </Stack>
    </View>
  );
}