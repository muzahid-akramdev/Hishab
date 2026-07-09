import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    const action = mode === 'login' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await action({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else if (mode === 'signup') {
      Alert.alert('Check your email', 'Confirm your email address to finish signing up, then log in.');
      setMode('login');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>Hishab</Text>
        <Text style={styles.brandSubtitle}>হিসাব · your daily ledger</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>{mode === 'login' ? 'Log in' : 'Create account'}</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={colors.inkFaint}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.inkFaint}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.submitText}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  brand: { alignItems: 'center', marginBottom: 32 },
  brandTitle: { fontSize: 34, fontWeight: '800', color: colors.ink, letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 14, color: colors.gold, marginTop: 4, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: colors.inkMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 16,
  },
  submitBtn: { backgroundColor: colors.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  submitText: { color: colors.background, fontWeight: '700', fontSize: 15 },
  switchBtn: { marginTop: 16, alignItems: 'center' },
  switchText: { color: colors.inkMuted, fontSize: 13, fontWeight: '600' },
});
