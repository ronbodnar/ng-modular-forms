import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from './mat-form-control-base';
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
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <mat-form-field
      class="w-full"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <textarea
        matInput
        [id]="id"
        [rows]="rows()"
        [cols]="cols()"
        [value]="value"
        [disabled]="_disabled()"
        [readonly]="readonly"
        [placeholder]="placeholder"
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
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>
        {{ getErrorMessage() }}
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
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
