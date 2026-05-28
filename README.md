# Comissões

A local-first Android app for tracking sales and projecting monthly commission income. Built with React Native + Expo, distributed as a shareable APK (no Play Store needed).

UI is in Brazilian Portuguese (pt-BR); code, identifiers, and comments are in English.

See [implementation-plan.md](./implementation-plan.md) for the full design document.

---

## What it does

- Log sales: value, type (Loja / Gestor), customer, date.
- Compute when each sale's commission installments hit, based on company rules.
- Show projected income for upcoming months and historical earnings.
- All data lives on the device. No backend, no login.

## Commission rules

| Type | Rate | Installments |
|---|---|---|
| Loja (store) | 1% of sale | 4 monthly installments |
| Gestor (manager) | 4% of sale | 10 monthly installments |

**First installment month** depends on the sale day:

- `threshold = 29` if the sale is in February, else `30`.
- If `day < threshold` → first installment is the **next** month.
- Otherwise → first installment is the **month after next**.

Example: a R$ 5.000,00 manager sale on Jan 15 → R$ 200,00 total commission → R$ 20,00/month from Feb to Nov.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 52+ |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Storage | expo-sqlite |
| Dates | date-fns + `date-fns/locale/pt-BR` |
| Date picker | `@react-native-community/datetimepicker` |
| Build | EAS Build (APK, internal distribution) |
| Testing | Jest + `@testing-library/react-native` |

## Getting started

```bash
# Create the project
npx create-expo-app@latest comissoes --template default
cd comissoes

# Runtime deps
npx expo install expo-sqlite expo-status-bar expo-router \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated \
  @react-native-community/datetimepicker
npm install date-fns uuid
npm install --save-dev @types/uuid

# Dev / testing
npm install --save-dev jest @types/jest jest-expo @testing-library/react-native

# EAS (free Expo account required)
npm install -g eas-cli
eas login
eas build:configure
```

Then run locally:

```bash
npx expo start
```

## Project structure

```
comissoes/
├── app/                     # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx            # Dashboard (Início)
│   ├── sales.tsx            # Vendas
│   ├── months.tsx           # Meses
│   ├── settings.tsx         # Ajustes
│   └── sale/
│       ├── new.tsx
│       └── [id].tsx
├── src/
│   ├── components/          # Button, Card, CurrencyInput, etc.
│   ├── db/                  # SQLite init + sales CRUD + migrations
│   ├── lib/
│   │   ├── commission.ts    # Core math (heart of the app)
│   │   ├── commission.test.ts
│   │   ├── format.ts        # BRL + date formatting
│   │   └── dates.ts
│   ├── theme.ts
│   ├── strings.ts           # All pt-BR strings
│   └── types.ts
├── assets/
├── app.json
├── eas.json
└── package.json
```

## Tests

The commission calculator is the one place a bug would silently produce wrong income projections — keep coverage on `src/lib/commission.ts` and don't ship if tests fail.

```bash
npm test
```

## Building an APK

`eas.json` is set up for internal distribution (no store needed):

```bash
eas build --platform android --profile preview
```

After ~10 min you get a URL to the APK. Send it to friends; they install directly on Android.

For JS-only fixes, push an over-the-air update instead of rebuilding:

```bash
eas update --branch preview --message "fix: corrige cálculo"
```

Native changes (new dependency, icon, app config) still require a fresh APK build.

## Data model

Sales are stored in SQLite with monetary values as **integer cents** to avoid floating-point rounding bugs. Display formatting divides by 100 at the last moment.

```ts
interface Sale {
  id: string;
  valueCents: number;       // integer cents
  type: 'store' | 'manager';
  customer: string;
  saleDate: string;         // YYYY-MM-DD
  createdAt: string;        // ISO datetime
}
```

## Roadmap

See section 15 of the [implementation plan](./implementation-plan.md) for a step-by-step build order (~22 hours of focused work).

Post-v1 ideas: charts, monthly goals, end-of-month reminders, JSON cloud backup, web/PWA build.
