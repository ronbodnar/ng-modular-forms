import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from './mat-form-control-base';
import { InputTextareaBehavior } from '@ng-modular-forms/behavior';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'nmf-mat-input-textarea',
  imports: [
    CommonModule,
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
      appearance="outline"
      [floatLabel]="shouldLabelFloat ? 'always' : 'auto'"
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
        [readonly]="readonly"
        [disabled]="disabled"
        [placeholder]="placeholder"
        style="padding-top: 5px"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown.enter)="onEnter()"
      ></textarea>

      @if (loading()) {
        <div class="absolute top-5 right-5 z-10">
          <mat-spinner diameter="20" strokeWidth="3"></mat-spinner>
        </div>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      @if (control().invalid && control().touched) {
        <mat-error>
          {{ getErrorMessage() }}
        </mat-error>
      }
    </mat-form-field>
  `,
})
export class InputTextareaComponent extends MatFormControlBase<string | null> {
  rows = input<number>(5);
  cols = input<number>(5);

  behavior = new InputTextareaBehavior();

  onEnter() {
    this.behavior.onEnter(this);
  }

  onInput(event: Event): void {
    this.behavior.onInput(this, event);
  }
}
