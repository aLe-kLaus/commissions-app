import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, spacing } from '../theme';
import { formatBRL, formatMonth } from '../lib/format';
import { MonthlyProjection } from '../types';
import { currentMonth } from '../lib/commission';

interface MonthSummaryCardProps {
  projection: MonthlyProjection;
  onPress?: () => void;
  highlight?: boolean;
}

export function MonthSummaryCard({ projection, onPress, highlight }: MonthSummaryCardProps) {
  const isCurrent = projection.month === currentMonth();
  return (
    <Card onPress={onPress} style={highlight ? styles.highlight : undefined}>
      <View style={styles.header}>
        <Text style={styles.month}>{formatMonth(projection.month)}</Text>
        {isCurrent ? <Badge label="Atual" variant="accent" /> : null}
      </View>
      <Text style={highlight ? styles.totalHighlight : styles.total}>
        {formatBRL(projection.totalCents)}
      </Text>
      <Text style={styles.count}>
        {projection.installments.length}{' '}
        {projection.installments.length === 1 ? 'parcela' : 'parcelas'}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  highlight: {
    borderColor: colors.accent,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  month: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  total: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  totalHighlight: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '700',
  },
  count: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
