import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  labelActive: {
    color: colors.ink,
  },
});
