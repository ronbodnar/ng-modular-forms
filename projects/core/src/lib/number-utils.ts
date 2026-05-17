export function parseNumber(
  input: string | number | null | undefined,
): number | null {
  if (input == null || input === '') return null;

  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : null;
  }

  const normalized = input
    .trim()
    .replace(/,/g, '') // remove thousands
    .replace(/(?!^)-/g, ''); // only allow leading '-'

  if (normalized === '-' || normalized === '.' || normalized === '-.') {
    return null;
  }

  const num = Number(normalized);

  return Number.isFinite(num) ? num : null;
}

export function formatNumber(
  value: string | number | null,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string | null {
  if (value == null || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    value = String(value);
  }

  value = value.replace(/[^\d\-,.]/g, '');

  if (value === '') {
    return null;
  }

  const isNegative = value.startsWith('-');
  const numericValue = Number(value.replace(/[,$-]/g, ''));
  const formatted = numericValue.toLocaleString(locale, options);

  return isNegative ? `-${formatted}` : formatted;
}
