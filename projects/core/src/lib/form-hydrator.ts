import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isRecord } from './type-guards';
import type { MapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormHydrator {
  hydrate<TModel extends Record<string, unknown>>(
    form: FormGroup,
    model: TModel,
    registry: MapperRegistry = {},
  ) {
    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in model)) return;

      const mapFn = registry[key]?.fromModel;
      const value = model?.[key];

      if (control instanceof FormGroup) {
        if (mapFn) {
          const mapped = mapFn(value);

          if (isRecord(mapped)) {
            control.patchValue(mapped, { emitEvent: false });
          }
        } else {
          this.hydrate(
            control,
            (value ?? {}) as Record<string, unknown>,
            registry,
          );
        }
        return;
      }

      control.patchValue(value, { emitEvent: false });
    });
  }
}
