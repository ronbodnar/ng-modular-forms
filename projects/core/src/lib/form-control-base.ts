import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import {
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControlValueAccessor } from './form-control-value-assessor';
import { tap } from 'rxjs';

@Directive()
export abstract class FormControlBase<T>
  extends FormControlValueAccessor<T>
  implements OnInit
{
  protected readonly destroyRef = inject(DestroyRef);

  readonly label = input<string>('');
  readonly classList = input<string[]>([]);
  readonly loading = input<boolean>(false);

  readonly _name = input<string>('', { alias: 'name' });
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean>(false, { alias: 'required' });
  readonly _disabled = input<boolean>(false, { alias: 'disabled' });
  readonly _readonly = input<boolean>(false, { alias: 'readonly' });

  get name(): string {
    return this._name();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get readonly(): boolean {
    return this._readonly();
  }

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  readonly control = computed(() => this.ngControl?.control);

  ngOnInit() {
    const control = this.ngControl?.control;
    if (!control) {
      throw new Error(`FormControl not found in parent FormGroup`);
    }

    control.valueChanges
      .pipe(
        tap((v) => {
          console.log('Value change: ', v);
        }),
      )
      .subscribe((s) => {
        console.log('Subbed response:', s);
      });

    control.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((change) => {
          console.log('Status change:', change);
        }),
      )
      .subscribe(() => this.cdr.markForCheck());
  }

  protected isRequired(): boolean {
    const control = this.control();
    return !!control && control.hasValidator(Validators.required);
  }

  protected serverError = computed(
    () => this.control()?.errors?.['server'] as string | undefined,
  );

  protected getErrorMessage(): string {
    const control = this.control();

    if (control == null || !control.errors || !control.touched) return '';

    const firstKey = Object.keys(control.errors)[0];
    const error = control.errors[firstKey];

    switch (firstKey) {
      case 'required':
        return 'This field is required';
      case 'minlength':
        return `Minimum length is ${error.requiredLength}`;
      case 'maxlength':
        return `Maximum length is ${error.requiredLength}`;
      case 'min':
        return `Minimum value is ${error.min}`;
      case 'max':
        return `Maximum value is ${error.max}`;
      case 'email':
        return 'Invalid email address';
      case 'pattern':
        return 'Invalid format';
      case 'server':
        return error;
      default:
        return 'Invalid value';
    }
  }
}
