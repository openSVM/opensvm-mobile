import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ColumnProps {
  children: React.ReactNode;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  style?: ViewStyle;
}

export function Column({ 
  children, 
  justify = 'flex-start', 
  align = 'stretch', 
  gap = 0, 
  style 
}: ColumnProps) {
  return (
    <View style={[
      styles.column,
      { justifyContent: justify, alignItems: align, gap },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});