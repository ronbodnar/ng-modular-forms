import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputCurrencyComponent } from './mat-input-currency.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MatInputCurrencyComponent', () => {
  let fixture: ComponentFixture<MatInputCurrencyComponent>;
  let component: MatInputCurrencyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputCurrencyComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputCurrencyComponent);
    component = fixture.componentInstance;
  });

  it('prevents default for non-digit keys', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    const event = new KeyboardEvent('keydown', { key: 'g', bubbles: true });
    vi.spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('parses and formats a valid number on input', () => {
    fixture.detectChanges();

    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).toHaveBeenCalledWith(1234);
    expect(component.displayValue()).toBe('1,234');
  });

  it('sets the text color to red for negative values', () => {
    fixture.detectChanges();

    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = '-1,234';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).toHaveBeenCalledWith(-1234);
    expect(component.textColor()).toBe('red');
  });

  it('does not render a prefix element when no value is present', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[matTextPrefix]'))).toBeNull();
  });

  it('clears the input and prefix when writeValue(null) is called', () => {
    component.writeValue(null);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.value).toBe('');
    expect(fixture.debugElement.query(By.css('[matTextPrefix]'))).toBeNull();
  });
});
