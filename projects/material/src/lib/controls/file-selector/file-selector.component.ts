import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
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
      [class.drag-drop-enabled]="enableDragDrop()"
      [class.drag-over]="isDragOver()"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
      [hideRequiredMarker]="hideRequiredMarker()"
      (drop)="onFileDrop($event)"
      (dragover)="onDragOver($event)"
      (dragenter)="onDragEnter($event)"
      (dragleave)="onDragLeave($event)"
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
  enableDragDrop = input<boolean>(true);

  isDragOver = signal(false);
  private dragDepth = 0;

  acceptAsString = computed(() => filesToAcceptString(this.accept()));

  fileName = computed(() =>
    formatFileName(this.value(), this.translate.bind(this)),
  );

  onFileSelected(event: Event) {
    if (this._disabledByInput()) return;

    const input = event.target as HTMLInputElement;
    this.selectFiles(Array.from(input.files ?? []));

    input.value = '';
  }

  onDragOver(event: DragEvent) {
    if (!this.enableDragDrop() || this._disabledByInput()) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDragEnter(event: DragEvent) {
    if (!this.enableDragDrop() || this._disabledByInput()) {
      return;
    }

    event.preventDefault();
    this.dragDepth += 1;
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    if (!this.enableDragDrop() || this._disabledByInput()) {
      return;
    }

    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);

    if (this.dragDepth === 0) {
      this.isDragOver.set(false);
    }
  }

  onFileDrop(event: DragEvent) {
    if (!this.enableDragDrop() || this._disabledByInput()) {
      return;
    }

    event.preventDefault();
    this.dragDepth = 0;
    this.isDragOver.set(false);

    this.selectFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  private selectFiles(files: File[]) {
    const selected = getSelectedFiles(
      files,
      this.multiple(),
      this.selectionMode(),
      this.value(),
    );

    this.onChange(selected);
  }
}
