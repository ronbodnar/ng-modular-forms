import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import type { MapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormSerializer {
  toRequest<TOptions extends object = object>(
    form: FormGroup | FormArray,
    registry: MapperRegistry = {},
    options?: TOptions,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.entries(form.controls).forEach(([key, control]) => {
      const mapFn = registry[key]?.toRequest;

      if (control instanceof FormControl) {
        result[key] = control.value;
        return;
      }

      if (control instanceof FormGroup || control instanceof FormArray) {
        result[key] = mapFn
          ? mapFn(control.value, options)
          : this.toRequest(control, registry, options);
        return;
      }
    });

    return result;
  }
}
