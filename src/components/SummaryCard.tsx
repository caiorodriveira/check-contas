import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  color?: string;
  style?: ViewStyle;
}

export default function SummaryCard({ title, value, color = '#1e293b', style }: SummaryCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
