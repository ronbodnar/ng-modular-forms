import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  SelectOption,
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  MatInputCurrencyComponent,
  MatInputTimepickerComponent,
  MatInputDatepickerComponent,
  MatInputNumberComponent,
} from '@ng-modular-forms/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormSectionComponent } from '../../ui/form-section/form-section.component';
import { DocsPageComponent } from '../../ui/docs-page/docs-page.component';
import { FormStatusOutputComponent } from '../../ui/form-status-output/form-status-output.component';

@Component({
  selector: 'app-material-inputs-example',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    MatInputCurrencyComponent,
    DocsPageComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
    MatInputTimepickerComponent,
    MatInputDatepickerComponent,
    MatInputNumberComponent,
  ],
  templateUrl: './material-inputs.component.html',
})
export class MaterialInputsExampleComponent implements OnInit {
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
    select: new FormControl('', Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [
      Validators.maxLength(500),
      Validators.required,
    ]),
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom', disabled: true },
    { key: 'de', label: 'Germany', disabled: true },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];

  // Example-specific -- not part of forms
  files = [
    {
      language: 'html',
      path: 'assets/examples/material-inputs/material-inputs.component.html',
    },
    {
      language: 'typescript',
      path: 'assets/examples/material-inputs/material-inputs.component.ts',
    },
  ];

  options = new FormGroup({
    appearance: new FormControl<'outline' | 'fill'>('outline'),
    loading: new FormControl(false),
    floatLabel: new FormControl<'auto' | 'always'>('auto'),
    disabled: new FormControl(false),
  });

  appearance = signal<'outline' | 'fill'>('outline');
  loading = signal(false);
  floatLabel = signal<'auto' | 'always'>('auto');

  ngOnInit(): void {
    this.options.valueChanges.subscribe((v) => {
      this.appearance.set(v.appearance ?? 'outline');
      this.loading.set(v.loading ?? false);
      this.floatLabel.set(v.floatLabel ?? 'auto');

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
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
