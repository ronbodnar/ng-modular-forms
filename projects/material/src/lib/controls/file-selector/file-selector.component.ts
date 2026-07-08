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
import {
  FileSelectorCapture,
  FileSelectorSelectionMode,
  filesToAcceptString,
  formatFileName,
  getSelectedFiles,
} from '@ng-modular-forms/core';

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
  multiple = input<boolean>(false);
  accept = input<string | string[] | null>(null);
  capture = input<FileSelectorCapture>(null);
  selectionMode = input<FileSelectorSelectionMode>('replace');

  acceptAsString = computed(() => filesToAcceptString(this.accept()));

  fileName = computed(() =>
    formatFileName(this.value(), this.translate.bind(this)),
  );

  onFileSelected(event: Event) {
    if (this._disabledByInput()) return;

    const input = event.target as HTMLInputElement;
    const selected = getSelectedFiles(
      Array.from(input.files ?? []),
      this.multiple(),
      this.selectionMode(),
      this.value(),
    );

    this.onChange(selected);

    input.value = '';
  }
}
