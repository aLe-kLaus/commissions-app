# App de Comissões — Implementation Plan

A local-first Android app for tracking sales and projecting monthly commission income. Built with React Native + Expo, distributed as a shareable APK (no Play Store needed).

---

## 1. Overview

**What the app does**

- User logs sales (value, type, customer, date).
- App computes when each sale's commission installments hit, based on company rules.
- User sees projected income for upcoming months and historical earnings.
- All data lives on the device. No backend, no login.

**Target audience**

You and a small group of friends. APK distributed manually.

**Language**

All visible content in Brazilian Portuguese (pt-BR). Code, variable names, and comments in English.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Expo SDK 52+** | Easiest modern RN setup. Handles Android tooling for you. |
| Language | **TypeScript** | Catches commission-math bugs early. |
| Navigation | **Expo Router** | File-based routing, current Expo default. |
| Storage | **expo-sqlite** | Queryable by month/type, better than AsyncStorage for this. |
| Dates | **date-fns** + `date-fns/locale/pt-BR` | Lightweight, immutable, great pt-BR support. |
| Forms | Plain `useState` | Only one form — no need for a form library. |
| Styling | **StyleSheet** + theme constants | Palette is tight, no need for Tailwind/NativeWind. |
| Date picker | **@react-native-community/datetimepicker** | Native Android picker. |
| Build | **EAS Build** | Cloud APK builds with one command. |
| Testing | **Jest** + `@testing-library/react-native` | For the commission calculator especially. |

---

## 3. Project Setup

```bash
# Create the project
npx create-expo-app@latest comissoes --template default

cd comissoes

# Install runtime dependencies
npx expo install expo-sqlite expo-status-bar expo-router \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated \
  @react-native-community/datetimepicker

npm install date-fns uuid
npm install --save-dev @types/uuid

# Install dev/testing dependencies
npm install --save-dev jest @types/jest jest-expo @testing-library/react-native

# Initialize EAS (you'll need a free Expo account)
npm install -g eas-cli
eas login
eas build:configure
```

Set the app name and slug in `app.json`:

```json
{
  "expo": {
    "name": "Comissões",
    "slug": "comissoes",
    "scheme": "comissoes",
    "android": {
      "package": "com.yourname.comissoes",
      "versionCode": 1
    }
  }
}
```

---

## 4. Project Structure

```
comissoes/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout, theme provider
│   ├── index.tsx                 # Dashboard (Início)
│   ├── sales.tsx                 # Sales list (Vendas)
│   ├── months.tsx                # Months breakdown (Meses)
│   ├── settings.tsx              # Settings (Ajustes)
│   └── sale/
│       ├── new.tsx               # Add sale form
│       └── [id].tsx              # Edit existing sale
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CurrencyInput.tsx
│   │   ├── SaleListItem.tsx
│   │   ├── MonthSummaryCard.tsx
│   │   └── EmptyState.tsx
│   ├── db/
│   │   ├── index.ts              # DB init + connection
│   │   ├── sales.ts              # CRUD for sales
│   │   └── migrations.ts         # Schema versioning
│   ├── lib/
│   │   ├── commission.ts         # Core math (HEART OF THE APP)
│   │   ├── commission.test.ts    # Unit tests
│   │   ├── format.ts             # BRL + date formatting
│   │   └── dates.ts              # Date helpers
│   ├── theme.ts                  # Colors, spacing, typography
│   ├── strings.ts                # All pt-BR strings
│   └── types.ts                  # Shared types
├── assets/
│   ├── icon.png                  # App icon (1024x1024)
│   └── splash.png
├── app.json
├── eas.json
├── tsconfig.json
└── package.json
```

---

## 5. Theme

`src/theme.ts`:

```ts
export const colors = {
  background: '#111625',     // Midnight Blue
  surface: '#0E89FF',        // Magalu Blue (cards, headers)
  surfaceDim: '#0E89FF22',   // 13% opacity blue for subtle cards
  accent: '#FF007F',         // Magenta (CTA, highlights)
  text: '#F8F9FA',
  textMuted: '#F8F9FA99',    // 60% opacity
  textDim: '#F8F9FA66',      // 40% opacity
  border: '#F8F9FA1A',       // 10% opacity for hairlines
  success: '#22C55E',
  danger: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 16, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  number: { fontSize: 32, fontWeight: '700' as const, color: colors.text },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
```

**Usage guidance for the Magenta accent:** use sparingly. Only on the primary CTA ("Nova Venda" FAB), the highlighted "projected salary" number on the Dashboard, and badges for current-month items. If everything is magenta, nothing pops.

---

## 6. Portuguese Strings

`src/strings.ts`:

```ts
export const t = {
  // App
  appName: 'Comissões',

  // Navigation tabs
  tabHome: 'Início',
  tabSales: 'Vendas',
  tabMonths: 'Meses',
  tabSettings: 'Ajustes',

  // Dashboard
  projectedSalary: 'Salário Previsto',
  nextMonth: 'Próximo Mês',
  upcomingMonths: 'Próximos Meses',
  totalPipeline: 'Total em Aberto',
  noSalesYet: 'Nenhuma venda registrada ainda',
  startByAddingSale: 'Comece adicionando sua primeira venda',

  // Sale form
  newSale: 'Nova Venda',
  editSale: 'Editar Venda',
  saleValue: 'Valor da Venda',
  saleType: 'Tipo de Venda',
  saleTypeStore: 'Loja',
  saleTypeManager: 'Gestor',
  customer: 'Cliente',
  customerPlaceholder: 'Para quem foi a venda',
  saleDate: 'Data da Venda',
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  confirmDelete: 'Tem certeza que deseja excluir esta venda?',

  // Sales list
  allSales: 'Todas as Vendas',
  filterByMonth: 'Filtrar por mês',
  filterAll: 'Todos',

  // Months view
  monthBreakdown: 'Detalhamento do Mês',
  installmentsThisMonth: 'Parcelas deste mês',
  fromSale: 'Da venda de',

  // Commission types
  commissionRate: 'Comissão',
  installmentsLabel: 'parcelas',
  ofLabel: 'de',

  // Settings
  exportData: 'Exportar Dados',
  importData: 'Importar Dados',
  clearAllData: 'Apagar Todos os Dados',
  confirmClearData: 'Isso apagará permanentemente todas as vendas. Continuar?',
  appVersion: 'Versão',

  // Validation
  errorRequired: 'Campo obrigatório',
  errorInvalidValue: 'Valor inválido',
  errorMustBePositive: 'O valor deve ser maior que zero',

  // Feedback
  saleSaved: 'Venda salva',
  saleDeleted: 'Venda excluída',
  dataCleared: 'Dados apagados',

  // Months (for short labels — date-fns will handle full names)
  monthShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
} as const;
```

Set the JS locale on app start so `Intl` formatting uses pt-BR conventions:

```ts
// app/_layout.tsx (top of file)
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
```

---

## 7. Types

`src/types.ts`:

```ts
export type SaleType = 'store' | 'manager';

export interface Sale {
  id: string;
  /** Stored in BRL cents (integer). Always multiply input by 100 before saving. */
  valueCents: number;
  type: SaleType;
  customer: string;
  /** ISO date string YYYY-MM-DD (no time component). */
  saleDate: string;
  /** ISO datetime, when the row was created. */
  createdAt: string;
}

export interface CommissionInstallment {
  saleId: string;
  /** YYYY-MM (e.g. "2026-02") */
  month: string;
  installmentNumber: number;
  totalInstallments: number;
  /** Amount in cents */
  amountCents: number;
}

export interface MonthlyProjection {
  /** YYYY-MM */
  month: string;
  totalCents: number;
  installments: CommissionInstallment[];
}
```

**Why cents:** floating-point arithmetic on currency causes rounding bugs (`0.1 + 0.2 !== 0.3`). Storing as integer cents and dividing only for display avoids this.

---

## 8. Database Layer (SQLite)

`src/db/index.ts`:

```ts
import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync('comissoes.db');
  await runMigrations(dbInstance);
  return dbInstance;
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY NOT NULL,
      value_cents INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('store', 'manager')),
      customer TEXT NOT NULL,
      sale_date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
  `);
}
```

`src/db/sales.ts`:

```ts
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './index';
import { Sale, SaleType } from '../types';

interface NewSaleInput {
  valueCents: number;
  type: SaleType;
  customer: string;
  saleDate: string; // YYYY-MM-DD
}

export async function createSale(input: NewSaleInput): Promise<Sale> {
  const db = await getDb();
  const sale: Sale = {
    id: uuidv4(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  await db.runAsync(
    `INSERT INTO sales (id, value_cents, type, customer, sale_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sale.id, sale.valueCents, sale.type, sale.customer, sale.saleDate, sale.createdAt]
  );
  return sale;
}

export async function updateSale(id: string, patch: Partial<NewSaleInput>): Promise<void> {
  const db = await getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];
  if (patch.valueCents !== undefined) { fields.push('value_cents = ?'); values.push(patch.valueCents); }
  if (patch.type !== undefined)       { fields.push('type = ?');         values.push(patch.type); }
  if (patch.customer !== undefined)   { fields.push('customer = ?');     values.push(patch.customer); }
  if (patch.saleDate !== undefined)   { fields.push('sale_date = ?');    values.push(patch.saleDate); }
  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE sales SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSale(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sales WHERE id = ?', [id]);
}

export async function getAllSales(): Promise<Sale[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string; value_cents: number; type: SaleType;
    customer: string; sale_date: string; created_at: string;
  }>('SELECT * FROM sales ORDER BY sale_date DESC');
  return rows.map(r => ({
    id: r.id,
    valueCents: r.value_cents,
    type: r.type,
    customer: r.customer,
    saleDate: r.sale_date,
    createdAt: r.created_at,
  }));
}

export async function clearAllSales(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sales');
}
```

---

## 9. Commission Calculator (Core Logic)

This is the most important file. Write tests for it first.

### 9.1 The rules, restated

- **Store sale (`loja`)**: 1% total commission, split equally over **4 months**.
- **Manager sale (`gestor`)**: 4% total commission, split equally over **10 months**.
- **First installment month** depends on the sale date:
  - For most months: if `day < 30`, first installment hits the **next month**; otherwise the **month after next**.
  - **For February**: if `day < 29` (which means day ≤ 28), next month; otherwise (Feb 29 in leap year) month after next.
  - Equivalently: `threshold = isFebruary ? 29 : 30`, push 1 month if `day < threshold`, else 2 months.

### 9.2 Code

`src/lib/commission.ts`:

```ts
import { Sale, SaleType, CommissionInstallment, MonthlyProjection } from '../types';

const RATES: Record<SaleType, number> = {
  store: 0.01,
  manager: 0.04,
};

const INSTALLMENT_COUNTS: Record<SaleType, number> = {
  store: 4,
  manager: 10,
};

/**
 * Given a sale date (YYYY-MM-DD), returns the YYYY-MM of the first commission month.
 */
export function firstCommissionMonth(saleDateISO: string): string {
  const [yearStr, monthStr, dayStr] = saleDateISO.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-12
  const day = parseInt(dayStr, 10);

  const threshold = month === 2 ? 29 : 30;
  const offset = day < threshold ? 1 : 2;

  return addMonths(year, month, offset);
}

/** Returns YYYY-MM after adding `n` months to year/month (1-12). */
export function addMonths(year: number, month: number, n: number): string {
  const total = year * 12 + (month - 1) + n;
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

/**
 * Splits a value in cents into `n` integer cents installments,
 * distributing rounding remainder across the first installments.
 */
export function splitCents(totalCents: number, n: number): number[] {
  const base = Math.floor(totalCents / n);
  const remainder = totalCents - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

/**
 * Returns all installments produced by a single sale.
 */
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

/**
 * Groups installments by month across all sales.
 * Returns a sorted array of monthly projections.
 */
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

/** Returns YYYY-MM for the current month (system local time). */
export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Returns the projection for the next month (the user's most-asked question). */
export function nextMonthProjection(sales: Sale[]): MonthlyProjection {
  const [y, m] = currentMonth().split('-').map(Number);
  const targetMonth = addMonths(y, m, 1);
  const all = projectionsByMonth(sales);
  return (
    all.find(p => p.month === targetMonth) ??
    { month: targetMonth, totalCents: 0, installments: [] }
  );
}
```

### 9.3 Tests

`src/lib/commission.test.ts`:

```ts
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
    valueCents: 100000, // R$ 1,000.00
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
    expect(total).toBe(1000); // R$ 10.00
  });
  test('starts in Feb 2026', () => {
    expect(installmentsForSale(sale)[0].month).toBe('2026-02');
  });
  test('months are consecutive', () => {
    const months = installmentsForSale(sale).map(i => i.month);
    expect(months).toEqual(['2026-02', '2026-03', '2026-04', '2026-05']);
  });
});

describe('installmentsForSale — manager', () => {
  const sale: Sale = {
    id: 's2',
    valueCents: 100000,
    type: 'manager',
    customer: 'Test',
    saleDate: '2026-01-31', // pushed to March
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
      { id: '1', valueCents: 100000, type: 'store', customer: 'A',
        saleDate: '2026-01-10', createdAt: '' }, // 250¢ per month, Feb-May
      { id: '2', valueCents: 200000, type: 'store', customer: 'B',
        saleDate: '2026-01-12', createdAt: '' }, // 500¢ per month, Feb-May
    ];
    const result = projectionsByMonth(sales);
    const feb = result.find(p => p.month === '2026-02');
    expect(feb?.totalCents).toBe(750);
    expect(feb?.installments).toHaveLength(2);
  });
});
```

Run tests with: `npm test`. **Do not move on until all tests pass.** This is the one place a bug would silently produce wrong income projections.

---

## 10. Formatting

`src/lib/format.ts`:

```ts
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Formats cents as Brazilian Real. e.g. 123456 → "R$ 1.234,56" */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parses BRL string input like "1.234,56" or "1234,56" or "1234.56" to cents. */
export function parseBRLToCents(input: string): number | null {
  // Remove all non-digit/comma/dot characters
  const cleaned = input.replace(/[^\d,\.]/g, '');
  if (!cleaned) return null;
  // If both . and , present, assume . is thousands separator (BR convention)
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned;
  const value = parseFloat(normalized);
  if (Number.isNaN(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** e.g. "2026-02-15" → "15 de fevereiro de 2026" */
export function formatLongDate(dateISO: string): string {
  return format(parseISO(dateISO), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/** e.g. "2026-02-15" → "15/02/2026" */
export function formatShortDate(dateISO: string): string {
  return format(parseISO(dateISO), 'dd/MM/yyyy', { locale: ptBR });
}

/** e.g. "2026-02" → "Fevereiro de 2026" */
export function formatMonth(monthISO: string): string {
  const [y, m] = monthISO.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

/** e.g. "2026-02" → "Fev 2026" */
export function formatMonthShort(monthISO: string): string {
  const [y, m] = monthISO.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return format(date, "MMM yyyy", { locale: ptBR });
}
```

---

## 11. Reusable Components

Build these first; every screen uses them.

### Button (`src/components/Button.tsx`)
- Props: `label`, `onPress`, `variant: 'primary' | 'secondary' | 'danger'`, `disabled`.
- Primary uses `colors.accent` (magenta) background.
- Secondary uses `colors.surface` (blue) background.
- Danger uses `colors.danger`.
- 48px min height (Android tap target).

### Card (`src/components/Card.tsx`)
- Rounded container with `colors.surfaceDim` background and `radius.md`.
- Padding `spacing.md`.

### CurrencyInput (`src/components/CurrencyInput.tsx`)
- TextInput with `keyboardType="numeric"`.
- Live-formats as user types (e.g. typing "1234" displays "R$ 12,34" — cents in, formatted out).
- Stores cents in state; exposes `onChangeCents(cents: number)`.

### SaleListItem
- Shows: customer name (bold), sale value, type badge ("Loja" or "Gestor"), date, commission amount.
- Tappable to edit.
- Long-press for delete confirmation.

### MonthSummaryCard
- Shows: month name, total commission for that month, count of installments contributing.
- Tappable to see breakdown.

### EmptyState
- Used on Dashboard and Sales list when no data.
- Icon + message + CTA button.

---

## 12. Screens

### 12.1 Root layout (`app/_layout.tsx`)

```tsx
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';
import { t } from '../src/strings';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        }}
      >
        <Tabs.Screen name="index" options={{ title: t.tabHome }} />
        <Tabs.Screen name="sales" options={{ title: t.tabSales }} />
        <Tabs.Screen name="months" options={{ title: t.tabMonths }} />
        <Tabs.Screen name="settings" options={{ title: t.tabSettings }} />
        <Tabs.Screen name="sale/new" options={{ href: null }} />
        <Tabs.Screen name="sale/[id]" options={{ href: null }} />
      </Tabs>
    </>
  );
}
```

### 12.2 Dashboard (`app/index.tsx`)

Layout, top to bottom:

1. **Hero card** — "Salário Previsto / Próximo mês" with the projected total in large magenta number. Below: month name (e.g. "Fevereiro de 2026").
2. **Upcoming months strip** — horizontal scroll of next 6 months, each showing month + total. Tap to navigate to that month's detail.
3. **Pipeline card** — "Total em Aberto" = sum of all future installments.
4. **Recent sales** — list of last 5 sales.
5. **FAB** (floating action button, magenta) — "Nova Venda", routes to `/sale/new`.

Data fetching: on mount and on focus (`useFocusEffect`), load all sales, run `projectionsByMonth`, derive needed slices.

### 12.3 Sales list (`app/sales.tsx`)

- Filter chips at top: "Todos" / month chips for months with sales.
- Vertical FlatList of SaleListItem components.
- Empty state if no sales.
- Tap item → edit screen.

### 12.4 Months breakdown (`app/months.tsx`)

- Vertical list of MonthSummaryCard, sorted by month descending (most recent first), including past months.
- Tap to expand and show the individual installments contributing to that month, each with: "R$ X,XX — Parcela 2 de 4 — Venda para Cliente Y em 15/01/2026".

### 12.5 New / Edit Sale (`app/sale/new.tsx` and `app/sale/[id].tsx`)

Form fields:
- **Valor da Venda** — CurrencyInput.
- **Tipo de Venda** — segmented control or two large buttons: Loja / Gestor.
- **Cliente** — TextInput.
- **Data da Venda** — read-only field that opens `DateTimePicker` on tap; displays formatted date in pt-BR. Defaults to today.

Bottom:
- "Salvar" button (primary, magenta).
- "Cancelar" link (text only).
- On edit screen, "Excluir" button at the bottom (danger variant) with confirmation `Alert.alert`.

After save, navigate back with `router.back()`.

### 12.6 Settings (`app/settings.tsx`)

- Export Data: serialize all sales to JSON, write to a file with `expo-file-system`, share with `expo-sharing`.
- Import Data: use `expo-document-picker` to pick a JSON file, validate, merge/replace.
- Clear All Data: with confirmation.
- App version (read from `expo-application` or hardcoded).

---

## 13. Build & Distribution

### 13.1 Configure EAS for APK builds

`eas.json`:

```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    }
  }
}
```

`distribution: "internal"` gives you a shareable link without going through any store.

### 13.2 Build

```bash
eas build --platform android --profile preview
```

Wait ~10 min. You'll get a URL to the APK. Send that to your friends. They open it on their Android phone, allow installs from this source if prompted, install. Done.

### 13.3 Updates

For minor fixes (JS-only changes), use **EAS Update** instead of rebuilding the APK:

```bash
eas update --branch preview --message "fix: corrige cálculo"
```

Users get the update next time they open the app. Saves a lot of "send the APK again" pain.

For changes to native code or app config (new dependency, icon change), rebuild the APK.

---

## 14. Future Enhancements (post-v1)

Skip these for v1 but worth planning around:

- **Charts** — line chart of monthly projections using `victory-native` or `react-native-svg-charts`.
- **Sale categories / tags** — e.g. product type, region.
- **Goals** — set a monthly income target, show progress.
- **Notifications** — reminder on the 28th of the month to log any last-minute sales.
- **Multi-rate support** — if commission rules ever change, store the rate snapshot on each sale so historical data stays accurate.
- **Cloud backup** — Google Drive folder via OAuth, opt-in.
- **PWA twin** — same codebase, deploy `expo export --platform web` and friends can use it on any device with no install.

---

## 15. Suggested Roadmap

A realistic order, with rough time estimates assuming evenings:

| # | Task | Time |
|---|---|---|
| 1 | Project setup, dependencies, folder structure, EAS configured | 1 h |
| 2 | `theme.ts`, `strings.ts`, `types.ts` | 30 min |
| 3 | Database layer + smoke-test inserting/reading a row | 1.5 h |
| 4 | **Commission calculator + tests (must all pass)** | 2 h |
| 5 | `format.ts` + tests | 30 min |
| 6 | Reusable components (Button, Card, CurrencyInput, badges) | 2 h |
| 7 | Root layout + tab navigation skeleton | 30 min |
| 8 | New Sale form (with date picker) | 2 h |
| 9 | Sales list screen | 1.5 h |
| 10 | Edit/delete sale flow | 1 h |
| 11 | Dashboard screen | 2 h |
| 12 | Months breakdown screen | 2 h |
| 13 | Settings (export/import/clear) | 2 h |
| 14 | Visual polish, empty states, error states | 2 h |
| 15 | First EAS build, install on a real phone, smoke test | 1 h |
| 16 | Fixes based on real-device testing | 2 h |
| 17 | Share APK with first friend, gather feedback | — |

Total: roughly **22 hours of focused work** — a long weekend or two normal ones.

---

## 16. Things to Decide Before Coding

1. **App icon and name on the home screen.** What should it be called? "Comissões" is fine but generic — something more personal works too.
2. **Customer field — free text or picklist of past customers?** Free text is faster for v1; can add autocomplete from history later.
3. **Should the dashboard's "Salário Previsto" show only the next-month projection, or should it also subtract anything (taxes, fixed costs)?** Keeping it pure (gross commission only) is cleanest for v1.
4. **Backup strategy.** If a friend loses their phone, all data is gone. Want to add JSON export from day one? (Strongly recommended — covered in Settings above.)

---

## 17. Quick Reference — Commission Math

```
threshold(month)        = 29 if month == 2 else 30
firstCommissionMonth    = saleMonth + 1 if saleDay < threshold(saleMonth) else saleMonth + 2
rate(type)              = 0.01 if 'store' else 0.04
installmentCount(type)  = 4 if 'store' else 10
installmentValue(sale)  = round(sale.valueCents * rate) / installmentCount
                          (with remainder cents distributed to earliest installments)
```

Sale on Jan 15, R$ 5,000.00, type `manager`:
- 4% × R$ 5,000 = **R$ 200.00 total commission**
- ÷ 10 = **R$ 20.00 per installment**
- Starts Feb 2026 (Jan 15 < 30), runs Feb 2026 → Nov 2026

Sale on Jan 31, R$ 5,000.00, type `manager`:
- Same R$ 200.00 total
- Starts **March 2026** (Jan 31 >= 30), runs Mar 2026 → Dec 2026
