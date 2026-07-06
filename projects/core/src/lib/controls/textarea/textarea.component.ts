import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../../base/form-control-base';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'nmf-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="translatedLabel()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="translatedErrorMessage()"
      [hintLabel]="translatedHintLabel()"
      [hintClassList]="hintClassList()"
    >
      <div
        class="nmf-control-wrapper nmf-textarea"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
      >
        <textarea
          #focusable
          class="nmf-control"
          [ngClass]="classList()"
          [class.error]="hasErrors()"
          [class.disabled]="disabled()"
          [id]="id()"
          [rows]="rows()"
          [cols]="cols()"
          [value]="value()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="isRequired()"
          [placeholder]="translatedPlaceholder()"
          [attr.aria-label]="ariaLabel() ?? translatedLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.autocomplete]="autocomplete()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (input)="onInput($event)"
        ></textarea>
      </div>
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
