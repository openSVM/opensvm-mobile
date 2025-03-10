import { Tabs } from 'expo-router';
import { Search, LineChart, Bot, Wallet, BarChart, TrendingUp, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/stores/theme-store';
import { TouchableOpacity, Linking } from 'react-native';

export default function TabLayout() {
  const { theme } = useThemeStore();

  const handleSIMDLinkPress = () => {
    Linking.openURL('https://forum.solana.com/t/proposal-for-introducing-a-programmatic-market-based-emission-mechanism-based-on-staking-participation-rate/3294');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="validators"
        options={{
          title: 'Validators',
          tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="solanow"
        options={{
          title: '[SIMD-0228]',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSIMDLinkPress}
              style={{ marginRight: 16 }}
            >
              <TrendingUp size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ color }) => <Bot size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}