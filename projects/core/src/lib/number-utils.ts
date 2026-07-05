export function parseNumber(
  input: string | number | null | undefined,
): number | null {
  if (input == null || input === '') return null;

  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : null;
  }

  let normalized = input.trim();

  // remove currency symbols and spaces
  normalized = normalized.replace(/[$€£¥₩₹\s]/g, '');

  // remove thousands separators
  normalized = normalized.replace(/,/g, '');

  // keep only one leading minus
  normalized = normalized.replace(/(?!^)-/g, '');

  if (normalized === '-' || normalized === '.' || normalized === '-.') {
    return null;
  }

  const num = Number(normalized);

  return Number.isFinite(num) ? num : null;
}

export function formatNumber(
  value: number | null,
  locale: string | undefined = undefined,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string | null {
  if (value == null || !Number.isFinite(value)) return null;

  return new Intl.NumberFormat(locale, options).format(value);
}
