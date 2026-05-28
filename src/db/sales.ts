import { getDb } from './index';
import { newId } from '../lib/id';
import { Sale, SaleType } from '../types';

interface NewSaleInput {
  valueCents: number;
  type: SaleType;
  customer: string;
  saleDate: string;
}

interface SaleRow {
  id: string;
  value_cents: number;
  type: SaleType;
  customer: string;
  sale_date: string;
  created_at: string;
}

function rowToSale(r: SaleRow): Sale {
  return {
    id: r.id,
    valueCents: r.value_cents,
    type: r.type,
    customer: r.customer,
    saleDate: r.sale_date,
    createdAt: r.created_at,
  };
}

export async function createSale(input: NewSaleInput): Promise<Sale> {
  const db = await getDb();
  const sale: Sale = {
    id: newId(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  await db.runAsync(
    `INSERT INTO sales (id, value_cents, type, customer, sale_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sale.id, sale.valueCents, sale.type, sale.customer, sale.saleDate, sale.createdAt],
  );
  return sale;
}

export async function updateSale(id: string, patch: Partial<NewSaleInput>): Promise<void> {
  const db = await getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];
  if (patch.valueCents !== undefined) {
    fields.push('value_cents = ?');
    values.push(patch.valueCents);
  }
  if (patch.type !== undefined) {
    fields.push('type = ?');
    values.push(patch.type);
  }
  if (patch.customer !== undefined) {
    fields.push('customer = ?');
    values.push(patch.customer);
  }
  if (patch.saleDate !== undefined) {
    fields.push('sale_date = ?');
    values.push(patch.saleDate);
  }
  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE sales SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSale(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sales WHERE id = ?', [id]);
}

export async function getSale(id: string): Promise<Sale | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<SaleRow>('SELECT * FROM sales WHERE id = ?', [id]);
  return row ? rowToSale(row) : null;
}

export async function getAllSales(): Promise<Sale[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SaleRow>(
    'SELECT * FROM sales ORDER BY sale_date DESC, created_at DESC',
  );
  return rows.map(rowToSale);
}

export async function clearAllSales(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sales');
}

export async function bulkInsertSales(sales: Sale[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const sale of sales) {
      await db.runAsync(
        `INSERT OR REPLACE INTO sales (id, value_cents, type, customer, sale_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sale.id, sale.valueCents, sale.type, sale.customer, sale.saleDate, sale.createdAt],
      );
    }
  });
}
