import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface RowProps {
  children: React.ReactNode;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  style?: ViewStyle;
}

export function Row({ 
  children, 
  justify = 'flex-start', 
  align = 'center', 
  gap = 0, 
  style 
}: RowProps) {
  return (
    <View style={[
      styles.row,
      { justifyContent: justify, alignItems: align, gap },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});