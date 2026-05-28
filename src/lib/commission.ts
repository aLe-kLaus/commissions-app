import { Sale, SaleType, CommissionInstallment, MonthlyProjection } from '../types';

const RATES: Record<SaleType, number> = {
  store: 0.01,
  manager: 0.04,
};

const INSTALLMENT_COUNTS: Record<SaleType, number> = {
  store: 4,
  manager: 10,
};

export function firstCommissionMonth(saleDateISO: string): string {
  const [yearStr, monthStr, dayStr] = saleDateISO.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const threshold = month === 2 ? 29 : 30;
  const offset = day < threshold ? 1 : 2;

  return addMonths(year, month, offset);
}

export function addMonths(year: number, month: number, n: number): string {
  const total = year * 12 + (month - 1) + n;
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

export function splitCents(totalCents: number, n: number): number[] {
  const base = Math.floor(totalCents / n);
  const remainder = totalCents - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

export function installmentsForSale(sale: Sale): CommissionInstallment[] {
  const totalCommissionCents = Math.round(sale.valueCents * RATES[sale.type]);
  const count = INSTALLMENT_COUNTS[sale.type];
  const amounts = splitCents(totalCommissionCents, count);
  const startMonth = firstCommissionMonth(sale.saleDate);
  const [startYear, startMonthNum] = startMonth.split('-').map(Number);

  return amounts.map((amountCents, i) => ({
    saleId: sale.id,
    month: addMonths(startYear, startMonthNum, i),
    installmentNumber: i + 1,
    totalInstallments: count,
    amountCents,
  }));
}

export function projectionsByMonth(sales: Sale[]): MonthlyProjection[] {
  const byMonth = new Map<string, CommissionInstallment[]>();
  for (const sale of sales) {
    for (const inst of installmentsForSale(sale)) {
      const list = byMonth.get(inst.month) ?? [];
      list.push(inst);
      byMonth.set(inst.month, list);
    }
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, installments]) => ({
      month,
      totalCents: installments.reduce((sum, i) => sum + i.amountCents, 0),
      installments,
    }));
}

export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function nextMonthProjection(sales: Sale[]): MonthlyProjection {
  const [y, m] = currentMonth().split('-').map(Number);
  const targetMonth = addMonths(y, m, 1);
  const all = projectionsByMonth(sales);
  return (
    all.find((p) => p.month === targetMonth) ?? {
      month: targetMonth,
      totalCents: 0,
      installments: [],
    }
  );
}

export function upcomingMonths(sales: Sale[], count: number): MonthlyProjection[] {
  const [y, m] = currentMonth().split('-').map(Number);
  const all = projectionsByMonth(sales);
  const map = new Map(all.map((p) => [p.month, p]));
  const result: MonthlyProjection[] = [];
  for (let i = 1; i <= count; i++) {
    const month = addMonths(y, m, i);
    result.push(map.get(month) ?? { month, totalCents: 0, installments: [] });
  }
  return result;
}

export function totalPipelineCents(sales: Sale[]): number {
  const current = currentMonth();
  const all = projectionsByMonth(sales);
  return all
    .filter((p) => p.month >= current)
    .reduce((sum, p) => sum + p.totalCents, 0);
}

export function commissionRate(type: SaleType): number {
  return RATES[type];
}

export function installmentCount(type: SaleType): number {
  return INSTALLMENT_COUNTS[type];
}
