import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'surface' | 'outlined';
  padding?: number;
}

export function Card({ 
  children, 
  style, 
  variant = 'default',
  padding = 16 
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding },
    style
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
  },
  default: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  surface: {
    backgroundColor: colors.surfaceLight,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
});