import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SaleForm, SaleFormValue } from '../../src/components/SaleForm';
import { deleteSale, getSale, updateSale } from '../../src/db/sales';
import { colors } from '../../src/theme';
import { t } from '../../src/strings';

export default function EditSaleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [initial, setInitial] = useState<SaleFormValue | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const sale = await getSale(id);
      if (!cancelled) {
        if (sale) {
          setInitial({
            valueCents: sale.valueCents,
            type: sale.type,
            customer: sale.customer,
            saleDate: sale.saleDate,
          });
        } else {
          Alert.alert('Venda não encontrada');
          router.back();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!initial) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  async function handleSubmit(value: SaleFormValue) {
    if (!id) return;
    await updateSale(id, value);
    router.back();
  }

  function handleDelete() {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          if (!id) return;
          await deleteSale(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SaleForm
      initialValue={initial}
      submitLabel={t.save}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      onDelete={handleDelete}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
