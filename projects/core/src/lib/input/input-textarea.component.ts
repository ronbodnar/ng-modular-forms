import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../base/form-control-base';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'nmf-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="label()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="errorMessage()"
    >
      <textarea
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id"
        [rows]="rows()"
        [cols]="cols()"
        [value]="value"
        [disabled]="disabled()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        (blur)="onTouched()"
        (input)="onInput($event)"
      ></textarea>
    </nmf-form-field>
  `,
})
export class InputTextareaComponent extends FormControlBase<string | null> {
  rows = input<number>(5);
  cols = input<number>(5);

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const input = event.target as HTMLTextAreaElement;
    this.onChange(input.value);
  }
}
