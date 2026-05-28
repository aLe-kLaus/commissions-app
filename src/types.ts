export type SaleType = 'store' | 'manager';

export interface Sale {
  id: string;
  valueCents: number;
  type: SaleType;
  customer: string;
  saleDate: string;
  createdAt: string;
}

export interface CommissionInstallment {
  saleId: string;
  month: string;
  installmentNumber: number;
  totalInstallments: number;
  amountCents: number;
}

export interface MonthlyProjection {
  month: string;
  totalCents: number;
  installments: CommissionInstallment[];
}
