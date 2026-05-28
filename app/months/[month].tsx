import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useSales } from '../../src/hooks/useSales';
import { projectionsByMonth } from '../../src/lib/commission';
import { Card } from '../../src/components/Card';
import { colors, radius, spacing } from '../../src/theme';
import { formatBRL, formatMonth, formatShortDate } from '../../src/lib/format';
import { t } from '../../src/strings';

export default function MonthDetailScreen() {
  const { month } = useLocalSearchParams<{ month: string }>();
  const { sales, loading } = useSales();

  const projection = useMemo(() => {
    const all = projectionsByMonth(sales);
    return all.find((p) => p.month === month);
  }, [sales, month]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const monthLabel = month ? formatMonth(month) : '';

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.label}>{monthLabel}</Text>
          <Text style={styles.total}>{formatBRL(projection?.totalCents ?? 0)}</Text>
          <Text style={styles.count}>
            {projection?.installments.length ?? 0}{' '}
            {(projection?.installments.length ?? 0) === 1 ? 'parcela' : 'parcelas'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t.installmentsThisMonth}</Text>

        {(projection?.installments ?? []).map((inst) => {
          const sale = sales.find((s) => s.id === inst.saleId);
          return (
            <Card
              key={`${inst.saleId}-${inst.installmentNumber}`}
              onPress={sale ? () => router.push(`/sale/${sale.id}`) : undefined}
              style={styles.itemCard}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemAmount}>{formatBRL(inst.amountCents)}</Text>
                <Text style={styles.itemBadge}>
                  {t.installment} {inst.installmentNumber} {t.ofLabel} {inst.totalInstallments}
                </Text>
              </View>
              {sale ? (
                <Text style={styles.itemMeta}>
                  {t.fromSale} {formatShortDate(sale.saleDate)} — {sale.customer}
                </Text>
              ) : null}
            </Card>
          );
        })}

        {(projection?.installments.length ?? 0) === 0 ? (
          <Text style={styles.empty}>Nenhuma parcela neste mês.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  total: {
    color: colors.accent,
    fontSize: 36,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  count: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  itemAmount: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  itemBadge: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  itemMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
