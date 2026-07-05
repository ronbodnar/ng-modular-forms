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

      @if (showSlots()) {
        <div class="nmf-mat-prefix-slot">
          @if (prefix() != null) {
            <span>{{ prefix() }}</span>
          }
          <ng-content select="[nmfPrefix]"></ng-content>
        </div>
      }

      <input
        #focusable
        matInput
        [ngClass]="classList"
        [id]="id()"
        [name]="name()"
        [type]="computedType()"
        [required]="isRequired()"
        [placeholder]="translatedPlaceholder()"
        [attr.aria-label]="ariaLabel() ?? translatedLabel()"
        [attr.aria-describedby]="ariaDescribedBy()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [attr.autocomplete]="autocomplete()"
        [attr.autocapitalize]="autocapitalize()"
        [attr.minlength]="minlength()"
        [attr.maxlength]="maxlength()"
        [attr.pattern]="pattern()"
        [formControl]="displayControl"
        (blur)="onFocusOut()"
        (focus)="onFocusIn()"
        (input)="onInput($event)"
      />

      @if (showSlots()) {
        <div class="nmf-mat-suffix-slot">
          @if (suffix() != null) {
            <span>{{ suffix() }}</span>
          }
          <ng-content select="[nmfSuffix]"></ng-content>
        </div>
      }

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

      <mat-error>{{ translatedErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTextComponent extends MatFormControlBase<string | null> {
  type = input<'text' | 'email' | 'tel' | 'url' | 'password' | 'search'>(
    'text',
  );
  autocapitalize = input<
    'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  >('off');

  minlength = input<number | null>(null);
  maxlength = input<number | null>(null);

  pattern = input<string | null>(null);

  prefix = input<string | null>(null);
  suffix = input<string | null>(null);

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
