export type DateFormat = 'short' | 'medium' | 'long';

const FORMAT_OPTIONS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  // Use 'numeric' for day so days < 10 don't have a leading zero (e.g. '5 jun 25')
  short: { day: 'numeric', month: 'short', year: '2-digit' },   // 5 jun 25
  medium: { day: 'numeric', month: 'short', year: 'numeric' }, // 5 jun 2025
  long: { day: 'numeric', month: 'long', year: 'numeric' },    // 5 de junio de 2025
};

/**
 * Safely formats a date-like value using Intl.DateTimeFormat.
 * Accepts Date | number | ISO string. Returns '-' for falsy/invalid values.
 */
export function formatDate(
  value: string | number | Date | null | undefined,
  opts?: { locale?: string; format?: DateFormat }
): string {
  if (!value) return '-';
  const { locale = (typeof navigator !== 'undefined' && navigator.language) || 'en-US', format = 'short' } = opts || {};

  const date = value instanceof Date ? value : (typeof value === 'number' ? new Date(value) : new Date(String(value)));
  if (Number.isNaN(date.getTime())) return '-';

  try {
    return new Intl.DateTimeFormat(locale, FORMAT_OPTIONS[format]).format(date);
  } catch {
    // fallback
    try {
      return date.toLocaleDateString();
    } catch {
      return '-';
    }
  }
}

export default formatDate;
