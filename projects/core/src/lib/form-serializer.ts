import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { MapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormSerializer {
  toRequest(form: FormGroup, registry: MapperRegistry = {}) {
    const result: Record<string, unknown> = {};

    Object.entries(form.controls).forEach(([key, control]) => {
      const mapFn = registry[key]?.toRequest;

      if (control instanceof FormGroup) {
        result[key] = mapFn
          ? mapFn(control.value)
          : this.toRequest(control, registry);
        return;
      }

      result[key] = control.value;
    });

    return result;
  }
}
