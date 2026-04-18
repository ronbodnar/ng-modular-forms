import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  computed,
  Directive,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControlValueAccessor } from './form-control-value-assessor';

@Directive()
export abstract class FormControlBase<T>
  extends FormControlValueAccessor<T>
  implements OnInit
{
  label = input<string>('');
  classList = input<string[]>([]);
  loading = input<boolean>(false);

  protected _form = signal<FormGroup>(new FormGroup({}));
  protected _controlName = signal<string>('');

  readonly form = this._form.asReadonly();
  readonly controlName = this._controlName.asReadonly();

  readonly control = computed(
    () => this._form().get(this._controlName()) as FormControl,
  );

  private parentFormGroup = inject(FormGroupDirective, {
    optional: true,
    host: true,
  });

  ngOnInit() {
    const controlName = this.formControlName() ?? 'default';
    const form = this.parentFormGroup?.form;

    if (!form) {
      throw new Error(
        `FormGroupDirective not found. Ensure component is used inside a form group`,
      );
    }

    this._form.set(form);
    this._controlName.set(controlName);

    const control = form.get(controlName);

    if (!control) {
      throw new Error(
        `FormControl '${controlName}' not found in parent FormGroup`,
      );
    }

    control.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }

  protected isRequired(): boolean {
    const control = this._form()?.get(this._controlName());
    return !!control && control.hasValidator(Validators.required);
  }

  protected serverError = computed(
    () => this.form()?.errors?.['server'] as string | undefined,
  );

  protected getErrorMessage(): string {
    const control = this._form()?.get(this._controlName());

    if (!control || !control.errors || !control.touched) return '';

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
