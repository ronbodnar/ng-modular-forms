import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InputCurrencyComponent,
  InputDatepickerComponent,
  InputNumberComponent,
  InputSelectComponent,
  InputTextareaComponent,
  InputTextComponent,
  InputTimepickerComponent,
  SelectOption,
} from '@ng-modular-forms/core';

@Component({
  selector: 'app-native-inputs-example',
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputNumberComponent,
    InputCurrencyComponent,
    InputDatepickerComponent,
    InputTimepickerComponent,
  ],
  templateUrl: './native-inputs.component.html',
})
export class NativeInputsExampleComponent {
  loading = signal(false);

  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    numberFormatted: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required),
    select: new FormControl<string | null>(null, Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [Validators.maxLength(500)]),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom', disabled: true },
    { key: 'de', label: 'Germany', disabled: true },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];
}
