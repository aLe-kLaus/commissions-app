import React from 'react';
import { router } from 'expo-router';
import { SaleForm, SaleFormValue } from '../../src/components/SaleForm';
import { createSale } from '../../src/db/sales';
import { todayISO } from '../../src/lib/dates';
import { t } from '../../src/strings';

const initial: SaleFormValue = {
  valueCents: 0,
  type: 'store',
  customer: '',
  saleDate: todayISO(),
};

export default function NewSaleScreen() {
  async function handleSubmit(value: SaleFormValue) {
    await createSale(value);
    router.back();
  }

  return (
    <SaleForm
      initialValue={initial}
      submitLabel={t.save}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
