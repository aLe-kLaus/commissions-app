import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Sale } from '../types';
import { colors, spacing } from '../theme';
import { formatBRL, formatShortDate } from '../lib/format';
import { commissionRate } from '../lib/commission';
import { t } from '../strings';

interface SaleListItemProps {
  sale: Sale;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function SaleListItem({ sale, onPress, onLongPress }: SaleListItemProps) {
  const commissionCents = Math.round(sale.valueCents * commissionRate(sale.type));
  return (
    <Card onPress={onPress} onLongPress={onLongPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.customer} numberOfLines={1}>
          {sale.customer}
        </Text>
        <Badge
          label={sale.type === 'store' ? t.saleTypeStore : t.saleTypeManager}
          variant={sale.type === 'store' ? 'store' : 'manager'}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{formatBRL(sale.valueCents)}</Text>
        <Text style={styles.date}>{formatShortDate(sale.saleDate)}</Text>
      </View>
      <Text style={styles.commission}>
        {t.commissionRate}: {formatBRL(commissionCents)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  customer: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
  },
  commission: {
    color: colors.accent,
    fontSize: 13,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});
