import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../../base/form-control-base';
import { PasswordBehavior } from '../../behavior/password/password.behavior';
import { FormFieldComponent } from '../form-field/form-field.component';
import { NmfPrefixDirective } from '../../directives/nmf-prefix.directive';
import { NmfSuffixDirective } from '../../directives/nmf-suffix.directive';

@Component({
  selector: 'nmf-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        [class.readonly]="readonly()"
        [class.has-prefix]="hasPrefix()"
        [class.has-suffix]="hasSuffix()"
      >
        @if (prefix() != null) {
          <span class="nmf-prefix">
            {{ prefix() }}
          </span>
        }
        <ng-content select="[nmfPrefix]" />

        <input
          #focusable
          class="nmf-control"
          [ngClass]="classList()"
          [id]="id()"
          [name]="name()"
          [type]="computedType()"
          [value]="value()"
          [disabled]="disabled()"
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
          [readonly]="readonly()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (input)="onInput($event)"
        />

        @if (type() === 'password' && !loading() && !disabled()) {
          <button
            type="button"
            class="nmf-password-toggle"
            aria-label="Toggle password visibility"
            (click)="passwordBehavior.toggleShowPassword($event)"
          >
            @if (passwordBehavior.showPassword()) {
              <ng-container [ngTemplateOutlet]="eyeOffIcon"></ng-container>
            } @else {
              <ng-container [ngTemplateOutlet]="eyeIcon"></ng-container>
            }
          </button>
        } @else if (type() !== 'password') {
          @if (suffix() != null) {
            <span class="nmf-suffix">
              {{ suffix() }}
            </span>
          }
          <ng-content select="[nmfSuffix]" />
        }
      </div>
    </nmf-form-field>

    <ng-template #eyeIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#e3e3e3"
        class="nmf-icon"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        />
      </svg>
    </ng-template>

    <ng-template #eyeOffIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#e3e3e3"
        class="nmf-icon"
      >
        <path
          d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z"
          fill="none"
        />
        <path
          d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        />
      </svg>
    </ng-template>
  `,
})
export class InputTextComponent extends FormControlBase<
  string | number | null
> {
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

  displayValue = signal<string | number | null>(null);

  passwordBehavior = new PasswordBehavior();

  prefixContent = contentChild(NmfPrefixDirective);
  suffixContent = contentChild(NmfSuffixDirective);

  hasPrefix = computed(() => !!this.prefix() || !!this.prefixContent());
  hasSuffix = computed(() => !!this.suffix() || !!this.suffixContent());

  readonly computedType = computed(() =>
    this.passwordBehavior.showPassword() && this.type() === 'password'
      ? 'text'
      : this.type(),
  );

  onInput(event: Event) {
    if (this._disabledByInput()) return;

    const value = (event.target as HTMLInputElement).value ?? null;
    this.onChange(value);
  }
}
