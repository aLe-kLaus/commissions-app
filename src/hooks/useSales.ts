import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllSales } from '../db/sales';
import { Sale } from '../types';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const rows = await getAllSales();
      setSales(rows);
    } catch (err) {
      console.error('Failed to load sales', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { sales, loading, reload };
}
