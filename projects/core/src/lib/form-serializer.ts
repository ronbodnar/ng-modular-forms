import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormSerializer {
  toRequest(form: FormGroup, registry: MapperRegistry = {}) {
    const result: any = {};

    Object.entries(form.controls).forEach(([key, control]) => {
      const mapper = registry[key];

      if (control instanceof FormGroup) {
        if (mapper) {
          result[key] = mapper.toRequest(control.value);
        } else {
          result[key] = this.toRequest(control, registry);
        }
        return;
      }

      result[key] = control.value;
    });

    return result;
  }
}
