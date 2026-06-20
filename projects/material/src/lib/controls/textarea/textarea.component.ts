import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'nmf-mat-textarea',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (translatedLabel() && detachLabel()) {
      <label class="font-medium text-base">{{ translatedLabel() }}</label>
    }

    <mat-form-field
      class="w-full"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (translatedLabel() && !detachLabel()) {
        <mat-label>{{ translatedLabel() }}</mat-label>
      }

      <textarea
        #focusable
        matInput
        [id]="id()"
        [rows]="rows()"
        [cols]="cols()"
        [required]="isRequired()"
        [placeholder]="translatedPlaceholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
        (blur)="onTouched()"
        (input)="onInput($event)"
      ></textarea>

      @if (loading()) {
        <mat-spinner
          matSuffix
          class="nmf-mat-loader"
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ translatedHint() }}</mat-hint>
      }

      <mat-error>
        {{ translatedErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
})
export class MatInputTextareaComponent extends MatFormControlBase<
  string | null
> {
  rows = input<number>(5);
  cols = input<number>(5);

  onInput(event: Event): void {
    const rawValue = (event.target as HTMLTextAreaElement).value;
    const value = rawValue ? rawValue : null;

    this.onChange(value);
  }
}
