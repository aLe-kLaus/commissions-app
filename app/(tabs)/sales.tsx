import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSales } from '../../src/hooks/useSales';
import { SaleListItem } from '../../src/components/SaleListItem';
import { EmptyState } from '../../src/components/EmptyState';
import { colors, radius, spacing } from '../../src/theme';
import { t } from '../../src/strings';
import { formatMonthShort } from '../../src/lib/format';
import { monthOfISO } from '../../src/lib/dates';

export default function SalesScreen() {
  const { sales, loading } = useSales();
  const [filter, setFilter] = useState<string>('all');

  const months = useMemo(() => {
    const set = new Set<string>();
    for (const s of sales) set.add(monthOfISO(s.saleDate));
    return [...set].sort().reverse();
  }, [sales]);

  const filtered = useMemo(() => {
    if (filter === 'all') return sales;
    return sales.filter((s) => monthOfISO(s.saleDate) === filter);
  }, [sales, filter]);

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
          icon="📋"
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
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip label={t.filterAll} active={filter === 'all'} onPress={() => setFilter('all')} />
          {months.map((m) => (
            <Chip
              key={m}
              label={formatMonthShort(m)}
              active={filter === m}
              onPress={() => setFilter(m)}
            />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <SaleListItem sale={item} onPress={() => router.push(`/sale/${item.id}`)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        onPress={() => router.push('/sale/new')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
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
  chipsWrapper: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chips: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDim,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: colors.text,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
  },
});
