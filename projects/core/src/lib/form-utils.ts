import type { AbstractControl, FormGroup } from '@angular/forms';
import { parseNumber } from './number-utils';

export function getControl<T extends AbstractControl>(
  controlName: string,
  form: FormGroup,
): T {
  if (!form) {
    throw new Error(
      `Missing form instance while getting the control of "${controlName}"`,
    );
  }

  const control = form.get(controlName);

  if (!control) {
    throw new Error(`Missing control "${controlName}" in form "${form}"`);
  }

  return control as T;
}

export function getControlValue<T = unknown>(
  controlName: string,
  form: FormGroup,
): T | null {
  const control = getControl<AbstractControl>(controlName, form);
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
