import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { formatBDT } from '../utils/format';

const mono = Platform.OS === 'android' ? 'monospace' : 'Menlo';

export default function SummaryCard({ income, expense }) {
  const profit = income - expense;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Stat label="Income" value={income} color={colors.sage} />
        <View style={styles.divider} />
        <Stat label="Expense" value={expense} color={colors.wine} />
      </View>
      <View style={styles.profitWrap}>
        <Text style={styles.profitLabel}>Profit</Text>
        <Text style={[styles.profitValue, { color: profit >= 0 ? colors.sage : colors.wine }]}>
          {formatBDT(profit)}
        </Text>
      </View>
    </View>
  );
}

function Stat({ label, value, color }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{formatBDT(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1 },
  statLabel: { fontSize: 12, color: colors.inkMuted, marginBottom: 4, letterSpacing: 0.3 },
  statValue: { fontSize: 19, fontWeight: '700', fontFamily: mono, fontVariant: ['tabular-nums'] },
  divider: { width: 1, height: 36, backgroundColor: colors.border, marginHorizontal: 14 },
  profitWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitLabel: { fontSize: 14, color: colors.ink, fontWeight: '600' },
  profitValue: { fontSize: 23, fontWeight: '800', fontFamily: mono, fontVariant: ['tabular-nums'] },
});
