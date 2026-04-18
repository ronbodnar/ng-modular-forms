import { Directive, ElementRef, input, signal, ViewChild } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FormControlBase } from '@ng-modular-forms/core';
import { Subject } from 'rxjs';

/**
 * Base implementation for custom form controls that integrate with:
 * - Angular Reactive Forms (ControlValueAccessor)
 * - Angular Material form-field (MatFormFieldControl)
 */

@Directive()
export abstract class MatFormControlBase<T>
  extends FormControlBase<T>
  implements MatFormFieldControl<T>
{
  detachLabel = input<boolean>(false);
  hint = input<string>();
  hintClassList = input<string>('');
  appearance = input<'outline' | 'fill'>();

  protected readonly _formDisabled = signal(false);

  /**
   * Notifies Angular Material form-field of state changes
   * (label float, error state, UI refresh)
   */
  stateChanges = new Subject<void>();

  override set value(val: T | null) {
    super.value = val;
    this.stateChanges.next();
  }

  focused = false;

  /**
   * Assumes derived component exposes an element with #input reference.
   */
  @ViewChild('nmf-input') input!: ElementRef<HTMLInputElement>;

  focus(): void {
    const nativeElement = this.input?.nativeElement;

    if (!nativeElement) {
      console.warn(
        'Tried to focus an input from FormControlBase that does not exist',
      );
      return;
    }

    this.focused = true;
    nativeElement.focus();
  }

  override get disabled(): boolean {
    return this._disabled() || this._formDisabled();
  }

  get errorState(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  get empty(): boolean {
    return this.value === null || this.value === '' || this.value === undefined;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  controlType: string | undefined = 'custom-form-control';
  autofilled: boolean | undefined = false;

  userAriaDescribedBy?: string | undefined;
  disableAutomaticLabeling?: boolean | undefined;

  override writeValue(value: T): void {
    super.writeValue(value);
    this.stateChanges.next();
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
    this.stateChanges.next();
    this.cdr.markForCheck();
  }

  setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target?.focus();
    this.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}
