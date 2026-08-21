import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../../base/form-control-base';
import { FormFieldComponent } from '../form-field/form-field.component';
import {
  filesToAcceptString,
  formatFileName,
  getSelectedFiles,
} from './file-selector.utils';
import {
  FileSelectorCapture,
  FileSelectorSelectionMode,
} from './file-selector.types';

@Component({
  selector: 'nmf-file-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      min-width: 0;
      flex: 1 1 0%;
    }
  `,
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
        class="nmf-control-wrapper"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [class.drag-drop-enabled]="enableDragDrop()"
        [class.drag-over]="isDragOver()"
        [style.box-shadow]="dragOverBoxShadow()"
        (drop)="onFileDrop($event)"
        (dragover)="onDragOver($event)"
        (dragenter)="onDragEnter($event)"
        (dragleave)="onDragLeave($event)"
      >
        <input
          #focusable
          class="nmf-control"
          type="text"
          [ngClass]="classList()"
          [id]="id()"
          [name]="name()"
          [value]="fileName()"
          [disabled]="disabled()"
          [readonly]="true"
          [required]="isRequired()"
          [placeholder]="translatedPlaceholder()"
          [attr.aria-label]="ariaLabel() ?? translatedLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.autocomplete]="autocomplete()"
          (click)="fileInput.click()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
        />

        <input
          #fileInput
          type="file"
          hidden
          [attr.accept]="acceptAsString()"
          [attr.capture]="capture()"
          [multiple]="multiple()"
          (change)="onFileSelected($event)"
        />

        <span
          class="nmf-suffix"
          [style.cursor]="'pointer'"
          (click)="fileInput.click()"
        >
          @if (!loading()) {
            <ng-container *ngTemplateOutlet="attachIcon"></ng-container>
          }
        </span>
      </div>
    </nmf-form-field>

    <ng-template #attachIcon>
      <!-- Angular Material attach_file icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="18px"
        viewBox="0 0 24 24"
        width="18px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"
        />
      </svg>
    </ng-template>
  `,
})
export class InputFileSelectorComponent extends FormControlBase<
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

  dragOverBoxShadow = computed(() =>
    this.isDragOver() ? '0 0 0 2px var(--nmf-input-accent-color)' : null,
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
