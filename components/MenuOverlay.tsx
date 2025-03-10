import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Settings, Moon, Sun, Globe, Shield, BookOpen, Github } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/stores/theme-store';

interface MenuOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function MenuOverlay({ visible, onClose }: MenuOverlayProps) {
  const { theme, toggleTheme } = useThemeStore();

  if (!visible) return null;

  const MenuItem = ({ icon: Icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon size={20} color={colors.text} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  const Content = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuItems}>
        <MenuItem 
          icon={theme === 'dark' ? Sun : Moon} 
          label={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onPress={toggleTheme}
        />
        <MenuItem 
          icon={Globe} 
          label="Network"
          onPress={() => {}}
        />
        <MenuItem 
          icon={Shield} 
          label="Security"
          onPress={() => {}}
        />
        <MenuItem 
          icon={BookOpen} 
          label="Documentation"
          onPress={() => {}}
        />
        <MenuItem 
          icon={Github} 
          label="GitHub"
          onPress={() => {}}
        />
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.overlay}>
        <View style={styles.backdrop} />
        <Content />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    fontSize: 32,
    color: colors.text,
    marginTop: -8,
  },
  menuItems: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
});