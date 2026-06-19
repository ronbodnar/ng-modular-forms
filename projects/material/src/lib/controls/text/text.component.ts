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
import { PasswordBehavior } from '@ng-modular-forms/core';

type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';

@Component({
  selector: 'nmf-mat-text',
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

      <input
        #focusable
        matInput
        [ngClass]="classList"
        [id]="id()"
        [name]="name()"
        [type]="computedType()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
        (blur)="onTouched()"
        (input)="onInput($event)"
      />

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

      @if (type() === 'password' && !loading()) {
        <button
          matIconSuffix
          mat-icon-button
          color="transparent"
          class="nmf-password-toggle"
          [disabled]="disabled()"
          (click)="behavior.toggleShowPassword($event)"
        >
          <mat-icon>{{
            behavior.showPassword() ? 'visibility_off' : 'visibility'
          }}</mat-icon>
        </button>
      }

      <ng-content></ng-content>

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTextComponent extends MatFormControlBase<string | null> {
  type = input<TextInputType>('text');

  behavior = new PasswordBehavior();

  computedType = computed(() =>
    this.behavior.showPassword() && this.type() === 'password'
      ? 'text'
      : this.type(),
  );

  onInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    const value = rawValue ? rawValue : null;

    this.onChange(value);
  }
}
