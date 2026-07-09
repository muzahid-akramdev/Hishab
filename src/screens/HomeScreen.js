import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { getRange } from '../utils/dateRanges';
import { formatDateHeader } from '../utils/format';
import SegmentedControl from '../components/SegmentedControl';
import SummaryCard from '../components/SummaryCard';
import EntryRow from '../components/EntryRow';
import AddEntrySheet from '../components/AddEntrySheet';

const FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'All time', value: 'all' },
];

export default function HomeScreen() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [filter, setFilter] = useState('today');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    const { start, end } = getRange(filter);

    let query = supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (start && end) {
      query = query.gte('entry_date', start.toISOString().slice(0, 10)).lte('entry_date', end.toISOString().slice(0, 10));
    }

    const { data, error } = await query;
    if (error) {
      Alert.alert('Could not load entries', error.message);
    } else {
      setEntries(data || []);
    }
  }, [userId, filter]);

  useEffect(() => {
    setLoading(true);
    fetchEntries().finally(() => setLoading(false));
  }, [fetchEntries]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  }

  async function handleDelete(id) {
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('entries').delete().eq('id', id);
          if (error) {
            Alert.alert('Could not delete', error.message);
          } else {
            setEntries((prev) => prev.filter((e) => e.id !== id));
          }
        },
      },
    ]);
  }

  const { income, expense, sections } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const byDate = {};

    for (const e of entries) {
      const amt = Number(e.amount) || 0;
      if (e.type === 'income') income += amt;
      else expense += amt;
      byDate[e.entry_date] = byDate[e.entry_date] || [];
      byDate[e.entry_date].push(e);
    }

    const sections = Object.keys(byDate)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({ title: formatDateHeader(date), data: byDate[date] }));

    return { income, expense, sections };
  }, [entries]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hishab</Text>
          <Text style={styles.subtitle}>হিসাব</Text>
        </View>
        <Pressable onPress={() => supabase.auth.signOut()} hitSlop={10}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.controlsWrap}>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <View style={styles.summaryWrap}>
        <SummaryCard income={income} expense={expense} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({ item }) => <EntryRow entry={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No entries yet. Tap + to add one.</Text>
            </View>
          ) : null
        }
      />

      <Pressable style={styles.fab} onPress={() => setSheetVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddEntrySheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSaved={fetchEntries}
        userId={userId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 12, color: colors.gold, fontWeight: '600', marginTop: -2 },
  signOut: { color: colors.inkMuted, fontSize: 13, fontWeight: '600' },
  controlsWrap: { paddingHorizontal: 20, marginBottom: 14 },
  summaryWrap: { paddingHorizontal: 20, marginBottom: 10 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkMuted,
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: colors.inkFaint, fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { fontSize: 30, color: colors.background, fontWeight: '600', marginTop: -2 },
});
