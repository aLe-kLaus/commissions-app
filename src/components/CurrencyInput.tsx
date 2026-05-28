import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { formatBRL } from '../lib/format';

interface CurrencyInputProps {
  valueCents: number;
  onChangeCents: (cents: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CurrencyInput({
  valueCents,
  onChangeCents,
  placeholder,
  autoFocus,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(valueCents > 0 ? formatBRL(valueCents) : '');

  useEffect(() => {
    setDisplay(valueCents > 0 ? formatBRL(valueCents) : '');
  }, [valueCents]);

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, '');
    if (!digits) {
      setDisplay('');
      onChangeCents(0);
      return;
    }
    const cents = parseInt(digits, 10);
    setDisplay(formatBRL(cents));
    onChangeCents(cents);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prefix}>R$</Text>
      <TextInput
        style={styles.input}
        value={display.replace(/^R\$\s*/, '')}
        onChangeText={handleChange}
        keyboardType="numeric"
        placeholder={placeholder ?? '0,00'}
        placeholderTextColor={colors.textDim}
        autoFocus={autoFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  prefix: {
    color: colors.textMuted,
    fontSize: 18,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: spacing.sm,
  },
});
