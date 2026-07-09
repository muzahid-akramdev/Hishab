import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Education', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Business', 'Gift', 'Other'];

export default function AddEntrySheet({ visible, onClose, onSaved, userId }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function switchType(next) {
    setType(next);
    setCategory(next === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  function resetForm() {
    setType('expense');
    setAmount('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setNote('');
    setDate(new Date());
  }

  async function handleSave() {
    const numeric = parseFloat(amount);
    if (!numeric || numeric <= 0) {
      Alert.alert('Invalid amount', 'Please enter an amount greater than 0.');
      return;
    }
    if (!userId) {
      Alert.alert('Not signed in', 'Please log in again.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('entries').insert({
      user_id: userId,
      type,
      category,
      amount: numeric,
      note: note.trim() || null,
      entry_date: date.toISOString().slice(0, 10),
    });
    setSaving(false);

    if (error) {
      Alert.alert('Could not save', error.message);
      return;
    }

    resetForm();
    onSaved();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Add entry</Text>

              <View style={styles.typeToggle}>
                <Pressable
                  style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
                  onPress={() => switchType('expense')}
                >
                  <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>Expense</Text>
                </Pressable>
                <Pressable
                  style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
                  onPress={() => switchType('income')}
                >
                  <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>Income</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Amount (৳)</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.inkFaint}
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.chipsWrap}>
                {categories.map((c) => {
                  const active = c === category;
                  return (
                    <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, active && styles.chipActive]}>
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note"
                placeholderTextColor={colors.inkFaint}
                value={note}
                onChangeText={setNote}
              />

              <Text style={styles.label}>Date</Text>
              <Pressable style={styles.dateBtn} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateBtnText}>{date.toDateString()}</Text>
              </Pressable>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  maximumDate={new Date()}
                  onChange={(event, selected) => {
                    setShowPicker(Platform.OS === 'ios');
                    if (selected) setDate(selected);
                  }}
                />
              )}

              <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save entry'}</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const mono = Platform.OS === 'android' ? 'monospace' : 'Menlo';

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(23,59,59,0.35)', justifyContent: 'flex-end' },
  sheetWrap: { maxHeight: '88%' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 16 },
  typeToggle: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeBtnExpenseActive: { backgroundColor: colors.wineSoft, borderColor: colors.wine },
  typeBtnIncomeActive: { backgroundColor: colors.sageSoft, borderColor: colors.sage },
  typeBtnText: { fontWeight: '700', color: colors.inkMuted },
  typeBtnTextActive: { color: colors.ink },
  label: { fontSize: 13, fontWeight: '600', color: colors.inkMuted, marginBottom: 8, marginTop: 4 },
  amountInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 16,
    fontFamily: mono,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  chipText: { fontSize: 13, color: colors.inkMuted, fontWeight: '600' },
  chipTextActive: { color: colors.ink },
  noteInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 16,
  },
  dateBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 22,
  },
  dateBtnText: { fontSize: 14, color: colors.ink, fontWeight: '600' },
  saveBtn: { backgroundColor: colors.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
  saveBtnText: { color: colors.background, fontWeight: '700', fontSize: 15 },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelBtnText: { color: colors.inkMuted, fontWeight: '600' },
});
