import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'nmf-mat-file-selector',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (translatedLabel() && detachLabel()) {
      <label class="nmf-mat-label-detached">{{ translatedLabel() }}</label>
    }

    <mat-form-field
      class="nmf-mat-field"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
      [hideRequiredMarker]="hideRequiredMarker()"
    >
      @if (translatedLabel() && !detachLabel()) {
        <mat-label>{{ translatedLabel() }}</mat-label>
      }

      <input
        matInput
        readonly
        [value]="fileName()"
        [ngClass]="classList"
        [id]="id()"
        [name]="name()"
        [readonly]="readonly()"
        [required]="isRequired()"
        [placeholder]="translatedPlaceholder()"
        [attr.aria-label]="ariaLabel() ?? translatedLabel()"
        [attr.aria-describedby]="ariaDescribedBy()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [attr.autocomplete]="autocomplete()"
        [formControl]="displayControl"
        (blur)="onFocusOut()"
        (focus)="onFocusIn()"
        (click)="fileInput.click()"
      />

      <button
        matSuffix
        mat-icon-button
        type="button"
        (click)="fileInput.click()"
      >
        <mat-icon>attach_file</mat-icon>
      </button>

      <input
        #fileInput
        hidden
        type="file"
        [attr.accept]="acceptAsString()"
        [attr.capture]="capture()"
        [multiple]="multiple()"
        (change)="onFileSelected($event)"
      />

      @if (loading()) {
        <mat-spinner
          matSuffix
          class="nmf-mat-loader"
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (translatedHintLabel()) {
        <mat-hint [ngClass]="hintClassList()">{{
          translatedHintLabel()
        }}</mat-hint>
      }

      <mat-error>{{ translatedErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputFileSelectorComponent extends MatFormControlBase<
  File | File[] | null
> {
  multiple = input<boolean>(true);
  accept = input<string | string[] | null>(null);
  capture = input<'user' | 'environment' | null>(null);

  acceptAsString = computed(() => {
    const accept = this.accept();

    if (Array.isArray(accept)) {
      return accept.join(',');
    }

    return accept;
  });

  fileName = computed(() => {
    const value = this.value();

    if (Array.isArray(value)) {
      return value.length === 1
        ? (value[0]?.name ?? '')
        : this.translate('fileSelector.filesSelected', {
            count: value.length,
          });
    }

    return value?.name ?? '';
  });

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files ?? null;

    if (this.multiple()) {
      this.onChange(Array.from(files ?? []));
    } else {
      this.onChange(files ? files[0] : null);
    }
  }
}
