import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '@ng-modular-forms/core';
import { InputTextBehavior } from '@ng-modular-forms/behavior';

@Component({
  selector: 'nmf-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-input-wrapper relative">
      @if (label()) {
        <label class="nmf-label block font-medium mb-1">
          {{ label() }}
        </label>
      }

      <div class="nmf-field relative flex items-center">
        <input
          autocomplete="off"
          class="nmf-input w-full"
          [ngClass]="classList()"
          [id]="id"
          [name]="name === 'identificationNumber' ? 'idummyi' : name"
          [type]="behavior.hidePassword() ? type() : 'text'"
          [readonly]="readonly"
          [placeholder]="placeholder"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [formControlName]="controlName()"
          [required]="isRequired()"
        />

        @if (type() === 'password') {
          <button
            type="button"
            class="nmf-password-toggle absolute right-2"
            (click)="toggleShowPassword($event)"
          >
            {{ behavior.hidePassword() ? '👁️‍🗨️' : '👁️' }}
          </button>
        }
      </div>

      <ng-content></ng-content>

      @if (control().invalid && control().touched) {
        <p class="nmf-error text-sm text-red-600 mt-1">
          {{ getErrorMessage() }}
        </p>
      }

      @if (loading()) {
        <div class="absolute top-2 right-2">
          <span class="nmf-spinner"></span>
        </div>
      }
    </div>
  `,
})
export class InputTextComponent extends FormControlBase<
  string | number | null
> {
  type = input<'text' | 'email' | 'tel' | 'url' | 'password'>('text');

  behavior = new InputTextBehavior();

  toggleShowPassword(event: MouseEvent) {
    this.behavior.toggleShowPassword(event);
  }

  onInput(event: Event): void {
    this.behavior.onInput(this, event);
  }
}
