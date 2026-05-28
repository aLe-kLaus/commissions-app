import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { CurrencyInput } from './CurrencyInput';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { SegmentedControl } from './SegmentedControl';
import { colors, spacing } from '../theme';
import { t } from '../strings';
import { SaleType } from '../types';
import { formatBRL } from '../lib/format';
import { commissionRate, installmentCount } from '../lib/commission';

export interface SaleFormValue {
  valueCents: number;
  type: SaleType;
  customer: string;
  saleDate: string;
}

interface SaleFormProps {
  initialValue: SaleFormValue;
  submitLabel: string;
  onSubmit: (value: SaleFormValue) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function SaleForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
  onDelete,
}: SaleFormProps) {
  const [valueCents, setValueCents] = useState(initialValue.valueCents);
  const [type, setType] = useState<SaleType>(initialValue.type);
  const [customer, setCustomer] = useState(initialValue.customer);
  const [saleDate, setSaleDate] = useState(initialValue.saleDate);
  const [submitting, setSubmitting] = useState(false);

  const commissionPreview = Math.round(valueCents * commissionRate(type));
  const installments = installmentCount(type);

  async function handleSubmit() {
    if (valueCents <= 0) {
      Alert.alert(t.errorInvalidValue, t.errorMustBePositive);
      return;
    }
    if (!customer.trim()) {
      Alert.alert(t.customer, t.errorRequired);
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit({ valueCents, type, customer: customer.trim(), saleDate });
    } catch (err) {
      Alert.alert('Erro', String(err));
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>{t.saleValue}</Text>
          <CurrencyInput valueCents={valueCents} onChangeCents={setValueCents} autoFocus />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t.saleType}</Text>
          <SegmentedControl
            options={[
              { value: 'store', label: t.saleTypeStore },
              { value: 'manager', label: t.saleTypeManager },
            ]}
            value={type}
            onChange={setType}
          />
        </View>

        <View style={styles.field}>
          <TextField
            label={t.customer}
            value={customer}
            onChangeText={setCustomer}
            placeholder={t.customerPlaceholder}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <DateField label={t.saleDate} valueISO={saleDate} onChange={setSaleDate} />
        </View>

        {valueCents > 0 ? (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Comissão prevista</Text>
            <Text style={styles.previewValue}>{formatBRL(commissionPreview)}</Text>
            <Text style={styles.previewMeta}>
              em {installments} {t.installmentsLabel}{' '}
              {t.ofLabel} {formatBRL(Math.floor(commissionPreview / installments))}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={submitLabel}
            onPress={handleSubmit}
            loading={submitting}
            variant="primary"
          />
          <Button label={t.cancel} onPress={onCancel} variant="ghost" />
          {onDelete ? (
            <Button label={t.delete} onPress={onDelete} variant="danger" />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  preview: {
    backgroundColor: colors.surfaceDim,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  previewLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewValue: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  previewMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
