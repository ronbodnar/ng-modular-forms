import { FormControl, FormGroup } from '@angular/forms';

export function getControl<T = unknown>(controlName: string, form: FormGroup) {
  if (!form) {
    throw new Error(
      `Missing form instance while getting the control of "${controlName}"`,
    );
  }

  const control = form.get(controlName) as FormControl<T>;
  if (!control) {
    throw new Error(`Missing control "${controlName}" in form "${form}"`);
  }

  return control;
}

export function getControlValue<T = unknown>(
  controlName: string,
  form: FormGroup,
): T | null;

export function getControlValue(
  controlName: string,
  form: FormGroup,
): number | null;

export function getControlValue<T = unknown>(
  controlName: string,
  form: FormGroup,
): T | null {
  const control = getControl<T>(controlName, form);
  if (!control) {
    throw new Error(`Missing control "${controlName}" in form "${form}"`);
  }

  const value = control.getRawValue();
  if (value === '') {
    return null;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '');

    if (!Number.isNaN(Number(cleaned))) {
      return parseNumber(value) as T;
    }
  }

  return value;
}

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

export function formatCurrency(
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

  const isNegative = value.startsWith('-');
  const numericValue = Number(value.replace(/[,$-]/g, ''));
  const formatted = numericValue.toLocaleString(locale, options);

  return isNegative ? `-${formatted}` : formatted;
}
