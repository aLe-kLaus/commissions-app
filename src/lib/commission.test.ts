import {
  firstCommissionMonth,
  addMonths,
  splitCents,
  installmentsForSale,
  projectionsByMonth,
} from './commission';
import { Sale } from '../types';

describe('firstCommissionMonth', () => {
  test('Jan 29 → Feb', () => {
    expect(firstCommissionMonth('2026-01-29')).toBe('2026-02');
  });
  test('Jan 30 → Mar', () => {
    expect(firstCommissionMonth('2026-01-30')).toBe('2026-03');
  });
  test('Jan 31 → Mar', () => {
    expect(firstCommissionMonth('2026-01-31')).toBe('2026-03');
  });
  test('Feb 28 (non-leap) → Mar', () => {
    expect(firstCommissionMonth('2026-02-28')).toBe('2026-03');
  });
  test('Feb 28 (leap year) → Mar', () => {
    expect(firstCommissionMonth('2024-02-28')).toBe('2024-03');
  });
  test('Feb 29 (leap year) → Apr', () => {
    expect(firstCommissionMonth('2024-02-29')).toBe('2024-04');
  });
  test('Dec 29 → Jan next year', () => {
    expect(firstCommissionMonth('2026-12-29')).toBe('2027-01');
  });
  test('Dec 31 → Feb next year', () => {
    expect(firstCommissionMonth('2026-12-31')).toBe('2027-02');
  });
});

describe('addMonths', () => {
  test('crosses year boundary', () => {
    expect(addMonths(2026, 11, 3)).toBe('2027-02');
  });
});

describe('splitCents', () => {
  test('evenly divisible', () => {
    expect(splitCents(1000, 4)).toEqual([250, 250, 250, 250]);
  });
  test('with remainder — first installments absorb extra cents', () => {
    expect(splitCents(1001, 4)).toEqual([251, 250, 250, 250]);
    expect(splitCents(1003, 4)).toEqual([251, 251, 251, 250]);
  });
  test('sum always equals original', () => {
    for (const total of [1, 7, 99, 1234, 999999]) {
      for (const n of [4, 10]) {
        const parts = splitCents(total, n);
        expect(parts.reduce((a, b) => a + b, 0)).toBe(total);
      }
    }
  });
});

describe('installmentsForSale — store', () => {
  const sale: Sale = {
    id: 's1',
    valueCents: 100000,
    type: 'store',
    customer: 'Test',
    saleDate: '2026-01-15',
    createdAt: '2026-01-15T10:00:00Z',
  };

  test('produces 4 installments', () => {
    expect(installmentsForSale(sale)).toHaveLength(4);
  });
  test('total equals 1% of sale', () => {
    const total = installmentsForSale(sale).reduce((s, i) => s + i.amountCents, 0);
    expect(total).toBe(1000);
  });
  test('starts in Feb 2026', () => {
    expect(installmentsForSale(sale)[0].month).toBe('2026-02');
  });
  test('months are consecutive', () => {
    const months = installmentsForSale(sale).map((i) => i.month);
    expect(months).toEqual(['2026-02', '2026-03', '2026-04', '2026-05']);
  });
});

describe('installmentsForSale — manager', () => {
  const sale: Sale = {
    id: 's2',
    valueCents: 100000,
    type: 'manager',
    customer: 'Test',
    saleDate: '2026-01-31',
    createdAt: '2026-01-31T10:00:00Z',
  };

  test('produces 10 installments', () => {
    expect(installmentsForSale(sale)).toHaveLength(10);
  });
  test('total equals 4% of sale', () => {
    const total = installmentsForSale(sale).reduce((s, i) => s + i.amountCents, 0);
    expect(total).toBe(4000);
  });
  test('starts in March (Jan 31 pushes 2 months)', () => {
    expect(installmentsForSale(sale)[0].month).toBe('2026-03');
  });
  test('last installment is Dec 2026', () => {
    const list = installmentsForSale(sale);
    expect(list[9].month).toBe('2026-12');
  });
});

describe('projectionsByMonth', () => {
  test('sums overlapping installments from multiple sales', () => {
    const sales: Sale[] = [
      {
        id: '1',
        valueCents: 100000,
        type: 'store',
        customer: 'A',
        saleDate: '2026-01-10',
        createdAt: '',
      },
      {
        id: '2',
        valueCents: 200000,
        type: 'store',
        customer: 'B',
        saleDate: '2026-01-12',
        createdAt: '',
      },
    ];
    const result = projectionsByMonth(sales);
    const feb = result.find((p) => p.month === '2026-02');
    expect(feb?.totalCents).toBe(750);
    expect(feb?.installments).toHaveLength(2);
  });
});
