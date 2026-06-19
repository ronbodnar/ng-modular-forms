import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputNumberComponent } from './number.component';
import { Mock, describe, it, beforeEach, expect, vi } from 'vitest';
import { NmfPrefixDirective, NmfSuffixDirective } from '@ng-modular-forms/core';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberComponent,
    NmfPrefixDirective,
    NmfSuffixDirective,
  ],
  template: `
    <form [formGroup]="form">
      <nmf-number
        formControlName="number"
        [formatValue]="formatValue"
        [disabledOverride]="disabled"
        [negativeColor]="negativeColor"
        [allowNegative]="allowNegative"
        [prefix]="prefixValue"
        [suffix]="suffixValue"
      />
    </form>
  `,
})
class HostComponent {
  formatValue = false;
  disabled = false;
  negativeColor: string | null = null;
  allowNegative = true;
  prefixValue: string | null = null;
  suffixValue: string | null = null;

  form = new FormGroup({
    number: new FormControl<number | null>(null),
  });
}

describe('InputNumberComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: InputNumberComponent;
  let host: HostComponent;
  let input: HTMLInputElement;
  let onChange: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    host = fixture.componentInstance;
    component = fixture.debugElement.query(
      By.directive(InputNumberComponent),
    ).componentInstance;

    input = fixture.debugElement.query(By.css('input')).nativeElement;

    onChange = vi.fn();
    component.registerOnChange(onChange);
  });

  it('parses formatted numeric input and emits value when formatValue is true', () => {
    host.formatValue = true;
    fixture.detectChanges();

    input.value = '1,234';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith(1234);
  });

  it('does not allow negative values when allowNegative is false', () => {
    host.allowNegative = false;
    fixture.detectChanges();

    input.value = '-123';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.displayValue()).toContain('123');
  });

  it('allows negative values when allowNegative is true', () => {
    host.allowNegative = true;
    fixture.detectChanges();

    component.writeValue(-1234);

    fixture.detectChanges();

    expect(component.displayValue()).toContain('-1234');
  });

  it('applies negativeColor when value is negative', () => {
    host.negativeColor = 'red';
    fixture.detectChanges();

    component.writeValue(-123);

    fixture.detectChanges();

    expect(component.textColor()).toBe('red');
  });

  it('does not emit when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();

    input.value = '123';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders prefix and suffix when provided', () => {
    host.prefixValue = '$';
    host.suffixValue = 'USD';
    fixture.detectChanges();

    const prefixSlot = fixture.debugElement.query(
      By.css('.nmf-control-wrapper .nmf-prefix'),
    );
    const suffixSlot = fixture.debugElement.query(
      By.css('.nmf-control-wrapper .nmf-suffix'),
    );

    expect(prefixSlot.nativeElement.textContent.trim()).toBe('$');
    expect(suffixSlot.nativeElement.textContent.trim()).toBe('USD');
  });

  it('updates prefix and suffix dynamically', () => {
    host.prefixValue = '$';
    host.suffixValue = 'USD';
    fixture.detectChanges();

    host.prefixValue = '€';
    host.suffixValue = 'EUR';
    fixture.detectChanges();

    const prefixSlot = fixture.debugElement.query(
      By.css('.nmf-control-wrapper .nmf-prefix'),
    );
    const suffixSlot = fixture.debugElement.query(
      By.css('.nmf-control-wrapper .nmf-suffix'),
    );

    expect(prefixSlot.nativeElement.textContent.trim()).toBe('€');
    expect(suffixSlot.nativeElement.textContent.trim()).toBe('EUR');
  });
});
