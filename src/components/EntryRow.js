import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { formatBDT } from '../utils/format';

const mono = Platform.OS === 'android' ? 'monospace' : 'Menlo';

export default function EntryRow({ entry, onDelete }) {
  const isIncome = entry.type === 'income';
  const amountColor = isIncome ? colors.sage : colors.wine;
  const sign = isIncome ? '+' : '−';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.category}>{entry.category}</Text>
        {!!entry.note && (
          <Text style={styles.note} numberOfLines={1}>
            {entry.note}
          </Text>
        )}
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {sign}
        {formatBDT(Math.abs(entry.amount))}
      </Text>
      <Pressable onPress={() => onDelete(entry.id)} hitSlop={10} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  left: { flex: 1, marginRight: 8 },
  category: { fontSize: 15, fontWeight: '600', color: colors.ink },
  note: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: mono,
    fontVariant: ['tabular-nums'],
    marginRight: 10,
  },
  deleteBtn: { padding: 4 },
  deleteText: { color: colors.inkFaint, fontSize: 14, fontWeight: '600' },
});
