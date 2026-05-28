import * as SQLite from 'expo-sqlite';

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
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
