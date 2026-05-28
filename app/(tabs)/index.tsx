import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSales } from '../../src/hooks/useSales';
import {
  nextMonthProjection,
  upcomingMonths,
  totalPipelineCents,
} from '../../src/lib/commission';
import { formatBRL, formatMonth, formatMonthShort } from '../../src/lib/format';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { SaleListItem } from '../../src/components/SaleListItem';
import { colors, spacing, radius } from '../../src/theme';
import { t } from '../../src/strings';

export default function Dashboard() {
  const { sales, loading } = useSales();

  const next = useMemo(() => nextMonthProjection(sales), [sales]);
  const upcoming = useMemo(() => upcomingMonths(sales, 6), [sales]);
  const pipeline = useMemo(() => totalPipelineCents(sales), [sales]);
  const recentSales = useMemo(() => sales.slice(0, 5), [sales]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (sales.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <EmptyState
          icon="💰"
          title={t.noSalesYet}
          message={t.startByAddingSale}
          actionLabel={t.newSale}
          onAction={() => router.push('/sale/new')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{t.projectedSalary}</Text>
          <Text style={styles.heroSubLabel}>{t.nextMonth}</Text>
          <Text style={styles.heroAmount}>{formatBRL(next.totalCents)}</Text>
          <Text style={styles.heroMonth}>{formatMonth(next.month)}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.upcomingMonths}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}
        >
          {upcoming.map((m, idx) => (
            <Pressable
              key={m.month}
              onPress={() => router.push(`/months/${m.month}`)}
              style={[styles.stripCard, idx === 0 && styles.stripCardFirst]}
            >
              <Text style={styles.stripMonth}>{formatMonthShort(m.month)}</Text>
              <Text style={styles.stripAmount}>{formatBRL(m.totalCents)}</Text>
              <Text style={styles.stripCount}>
                {m.installments.length} {m.installments.length === 1 ? 'parcela' : 'parcelas'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Card style={styles.pipelineCard}>
          <Text style={styles.pipelineLabel}>{t.totalPipeline}</Text>
          <Text style={styles.pipelineAmount}>{formatBRL(pipeline)}</Text>
        </Card>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>{t.recentSales}</Text>
          <Pressable onPress={() => router.push('/sales')}>
            <Text style={styles.seeAll}>{t.seeAll}</Text>
          </Pressable>
        </View>
        {recentSales.map((sale) => (
          <SaleListItem
            key={sale.id}
            sale={sale}
            onPress={() => router.push(`/sale/${sale.id}`)}
          />
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Pressable
        onPress={() => router.push('/sale/new')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>{t.newSale}</Text>
      </Pressable>
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
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroSubLabel: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  heroAmount: {
    color: colors.accent,
    fontSize: 44,
    fontWeight: '800',
    marginTop: spacing.sm,
    letterSpacing: -1,
  },
  heroMonth: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  stripContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    paddingRight: spacing.md,
  },
  stripCard: {
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.md,
    padding: spacing.md,
    minWidth: 130,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stripCardFirst: {
    borderColor: colors.accent,
  },
  stripMonth: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  stripAmount: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  stripCount: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  pipelineCard: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  pipelineLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pipelineAmount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  seeAll: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
  },
  fabIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  fabLabel: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
});
