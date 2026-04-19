import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  Optional,
  Self,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from './mat-form-control-base';
import { InputTextBehavior } from '@ng-modular-forms/behavior';

@Component({
  selector: 'nmf-mat-input-text',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => MatInputTextComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
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

        <input
          matInput
          autocomplete="off"
          [id]="id"
          [ngClass]="classList"
          [value]="value"
          [name]="name === 'identificationNumber' ? 'idummyi' : name"
          [type]="behavior.hidePassword() ? type() : 'text'"
          [readonly]="readonly"
          [placeholder]="placeholder"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [required]="isRequired()"
          style="padding-top: 5px"
        />

        @if (loading()) {
          <div class="absolute top-5 right-5 z-10">
            <mat-spinner diameter="20" strokeWidth="3"></mat-spinner>
          </div>
        }

        @if (hint()) {
          <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
        }

        @if (type() === 'password') {
          <button matIconSuffix (click)="toggleShowPassword($event)">
            <mat-icon>{{
              behavior.hidePassword() ? 'visibility_off' : 'visibility'
            }}</mat-icon>
          </button>
        }

        <ng-content></ng-content>

        @if (control()?.invalid && control()?.touched) {
          <mat-error>{{ getErrorMessage() }}</mat-error>
        }
      </mat-form-field>
    </div>
  `,
})
export class MatInputTextComponent extends MatFormControlBase<
  string | number | null
> {
  type = input<'text' | 'email' | 'tel' | 'url' | 'password'>('text');

  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  behavior = new InputTextBehavior();

  toggleShowPassword(event: MouseEvent) {
    this.behavior.toggleShowPassword(event);
  }

  onInput(event: Event): void {
    this.behavior.onInput(this, event);
  }
}
