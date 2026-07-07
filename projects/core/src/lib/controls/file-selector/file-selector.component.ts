import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../../base/form-control-base';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'nmf-file-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      input[type='file'] {
        display: block;
        width: 100%;
        height: 100%;
        padding: 2px;
        transition:
          border-color 0.15s ease-in-out,
          box-shadow 0.15s ease-in-out;
      }
    `,
  ],
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
        class="nmf-control-wrapper frameless-control"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [class.readonly]="readonly()"
      >
        <input
          #focusable
          class="nmf-control"
          type="file"
          [ngClass]="classList()"
          [id]="id()"
          [name]="name()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="isRequired()"
          [attr.aria-label]="ariaLabel() ?? translatedLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.autocomplete]="autocomplete()"
          [attr.accept]="acceptAsString()"
          [attr.capture]="capture()"
          [readonly]="readonly()"
          [multiple]="multiple()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (input)="onInput($event)"
        />
      </div>
    </nmf-form-field>
  `,
})
export class InputFileSelectorComponent extends FormControlBase<
  File | File[] | null
> {
  multiple = input<boolean>(false);
  accept = input<string | string[] | null>(null);
  capture = input<'user' | 'environment' | null>(null);

  acceptAsString = computed(() => {
    const accept = this.accept();

    if (Array.isArray(accept)) {
      return accept.join(',');
    }

    return accept;
  });

  onInput(event: Event) {
    if (this._disabledByInput()) return;

    const files = (event.target as HTMLInputElement).files ?? null;

    if (this.multiple()) {
      this.onChange(Array.from(files ?? []));
    } else {
      this.onChange(files ? files[0] : null);
    }
  }
}
