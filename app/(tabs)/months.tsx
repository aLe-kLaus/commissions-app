import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSales } from '../../src/hooks/useSales';
import { projectionsByMonth } from '../../src/lib/commission';
import { MonthSummaryCard } from '../../src/components/MonthSummaryCard';
import { EmptyState } from '../../src/components/EmptyState';
import { colors, spacing } from '../../src/theme';
import { t } from '../../src/strings';

export default function MonthsScreen() {
  const { sales, loading } = useSales();

  const projections = useMemo(() => projectionsByMonth(sales), [sales]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (projections.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <EmptyState
          icon="📅"
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
      <FlatList
        data={projections}
        keyExtractor={(p) => p.month}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <MonthSummaryCard
              projection={item}
              onPress={() => router.push(`/months/${item.month}`)}
            />
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  list: {
    padding: spacing.md,
  },
  itemWrapper: {
    marginBottom: spacing.sm,
  },
});
