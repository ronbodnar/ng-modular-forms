import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormHydrator {
  hydrate(form: FormGroup, model: any, registry: MapperRegistry = {}) {
    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in model)) return;

      const mapper = registry[key];
      const value = model?.[key];

      if (control instanceof FormGroup) {
        if (mapper) {
          control.patchValue(mapper.fromModel(value), { emitEvent: false });
        } else {
          this.hydrate(control, value, registry);
        }
        return;
      }

      control.patchValue(value, { emitEvent: false });
    });
  }
}
