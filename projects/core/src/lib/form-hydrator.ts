import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { isRecord } from './type-guards';
import type { FormMapperRegistry } from './types';

@Injectable({ providedIn: 'root' })
export class FormHydrator {
  hydrate(
    form: FormGroup | FormArray,
    model: unknown,
    registry: FormMapperRegistry = {},
    emitEvents: boolean = false,
  ) {
    if (form instanceof FormArray) {
      this.hydrateFormArray(form, model, registry, emitEvents);
      return;
    }

    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in (model as Record<string, unknown>))) {
        return;
      }

      const mapFn = registry[key]?.fromModel;
      const value = (model as Record<string, unknown>)[key];

      if (control instanceof FormArray) {
        this.hydrateFormArray(control, value, registry, emitEvents);
        return;
      }

      if (control instanceof FormGroup) {
        if (mapFn) {
          const mapped = mapFn(value);

          if (isRecord(mapped)) {
            control.patchValue(mapped, { emitEvent: emitEvents });
          }
        } else {
          this.hydrate(control, value ?? {}, registry, emitEvents);
        }
        return;
      }

      control.patchValue(value, { emitEvent: emitEvents });
    });
  }

  private hydrateFormArray(
    formArray: FormArray,
    model: unknown,
    registry: FormMapperRegistry,
    emitEvents: boolean = false,
  ) {
    const values = Array.isArray(model) ? model : [];

    if (values.length === 0) {
      formArray.clear();
      return;
    }

    if (formArray.length === 0) {
      formArray.push(this.createControlFromModel(values[0]));
    }

    while (formArray.length > values.length) {
      formArray.removeAt(formArray.length - 1);
    }

    while (formArray.length < values.length) {
      const template = formArray.at(formArray.length - 1) as
        | FormControl
        | FormGroup
        | FormArray;
      formArray.push(this.cloneControl(template));
    }

    values.forEach((item, index) => {
      const child = formArray.at(index);

      if (child instanceof FormGroup && isRecord(item)) {
        this.hydrate(child, item, registry, emitEvents);
      } else if (child instanceof FormArray && Array.isArray(item)) {
        this.hydrate(child, item, registry, emitEvents);
      } else {
        child.patchValue(item, { emitEvent: emitEvents });
      }
    });
  }

  private createControlFromModel(
    value: unknown,
  ): FormControl | FormGroup | FormArray {
    if (Array.isArray(value)) {
      return new FormArray(
        value.map((item) => this.createControlFromModel(item)),
      );
    }

    if (isRecord(value)) {
      return new FormGroup(
        Object.fromEntries(
          Object.keys(value).map((key) => [key, new FormControl(null)]),
        ),
      );
    }

    return new FormControl(null);
  }

  private cloneControl(
    control: FormControl | FormGroup | FormArray,
  ): FormControl | FormGroup | FormArray {
    if (control instanceof FormControl) {
      return new FormControl(null, control.validator, control.asyncValidator);
    }

    if (control instanceof FormGroup) {
      return new FormGroup(
        Object.fromEntries(
          Object.entries(control.controls).map(([key, child]) => [
            key,
            this.cloneControl(child as FormControl | FormGroup | FormArray),
          ]),
        ),
        {
          validators: control.validator,
          asyncValidators: control.asyncValidator,
          updateOn: control.updateOn,
        },
      );
    }

    return new FormArray(
      control.controls.map((child) =>
        this.cloneControl(child as FormControl | FormGroup | FormArray),
      ),
      {
        validators: control.validator,
        asyncValidators: control.asyncValidator,
      },
    );
  }
}
