import type { AbstractControl, FormGroup } from '@angular/forms';
import type { Observable, Subscription } from 'rxjs';
import { getControl } from '../form-utils';

export abstract class FormHandlerBase<
  TControls extends Record<string, AbstractControl>,
> {
  private _form!: FormGroup;

  abstract getReactiveLogic(form: FormGroup): Subscription;

  public initializeForm(form: FormGroup): void {
    this._form = form;
  }

  public getControl<TKey extends keyof TControls>(key: TKey): TControls[TKey] {
    const control = getControl(String(key), this._form);

    if (!control) {
      throw new Error(`Control "${String(key)}" not found.`);
    }

    return control as TControls[TKey];
  }

  public valueChangesOf<TKey extends keyof TControls>(
    key: TKey,
  ): Observable<TControls[TKey]['value']> {
    return this.getControl(key).valueChanges as Observable<
      TControls[TKey]['value']
    >;
  }
}
