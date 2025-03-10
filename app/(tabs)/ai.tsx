import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AIAssistant } from '@/components/AIAssistant';
import { colors } from '@/constants/colors';
import { ShaderBackground } from '@/components/ShaderBackground';

export default function AIScreen() {
  return (
    <View style={styles.container}>
      <ShaderBackground />
      <AIAssistant expanded />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});