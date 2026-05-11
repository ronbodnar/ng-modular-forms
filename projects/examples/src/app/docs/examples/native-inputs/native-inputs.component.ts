import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { FormSectionComponent } from '../../components/form-section/form-section.component';
import { FormExampleComponent } from '../../components/form-example/form-example.component';
import { FormStatusOutputComponent } from '../../components/form-status-output/form-status-output.component';

@Component({
  selector: 'app-native-inputs-example',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputNumberComponent,
    InputCurrencyComponent,
    InputDatepickerComponent,
    InputTimepickerComponent,
    FormExampleComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
  ],
  templateUrl: './native-inputs.component.html',
})
export class NativeInputsExampleComponent implements OnInit {
  files = [
    {
      language: 'html',
      path: 'assets/examples/native-inputs/native-inputs.component.html',
    },
    {
      language: 'typescript',
      path: 'assets/examples/native-inputs/native-inputs.component.ts',
    },
  ];

  options = new FormGroup({
    loading: new FormControl(false),
    disabled: new FormControl(false),
  });

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

  async ngOnInit(): Promise<void> {
    this.options.valueChanges.subscribe((v) => {
      this.loading.set(v.loading ?? false);
      if (v.disabled) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  populateForm(): void {
    this.form.patchValue({
      text: 'Hello World',
      number: 1230,
      numberFormatted: 1230,
      password: '12345678',
      select: 'us',
      currency: 1230,
      textarea: 'Hello\n\nWorld',
      date: new Date(),
      time: new Date(),
    });
  }

  validateForm(): void {
    this.form.get('text')?.markAsTouched();
    this.form.markAllAsTouched();
  }
}
