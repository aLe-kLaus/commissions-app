import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseBRLToCents(input: string): number | null {
  const cleaned = input.replace(/[^\d,.]/g, '');
  if (!cleaned) return null;
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned;
  const value = parseFloat(normalized);
  if (Number.isNaN(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function centsFromDigits(digits: string): number {
  const clean = digits.replace(/\D/g, '');
  if (!clean) return 0;
  return parseInt(clean, 10);
}

export function formatLongDate(dateISO: string): string {
  return format(parseISO(dateISO), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatShortDate(dateISO: string): string {
  return format(parseISO(dateISO), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatMonth(monthISO: string): string {
  const [y, m] = monthISO.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  const formatted = format(date, "MMMM 'de' yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatMonthShort(monthISO: string): string {
  const [y, m] = monthISO.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  const formatted = format(date, 'MMM yyyy', { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
