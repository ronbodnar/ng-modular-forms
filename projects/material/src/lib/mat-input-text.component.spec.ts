import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputTextComponent } from './mat-input-text.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MatInputTextComponent', () => {
  let fixture: ComponentFixture<MatInputTextComponent>;
  let component: MatInputTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputTextComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputTextComponent);
    component = fixture.componentInstance;
  });

  it('should format value when type is number and formatNumberValue is true', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.componentRef.setInput('formatNumberValue', true);
    fixture.detectChanges();

    component.writeValue(1234);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.type).toBe('text');
    expect(input.value).toBe('1,234');
  });

  it('should only allow digits or a decimal when type is number', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    component.writeValue('test');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.type).toBe('number');
    expect(input.value).toBe('');
  });

  it('should use text type for password when showPassword is true', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.type).toBe('password');

    component.behavior.toggleShowPassword();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });

  it('should call onChange with parsed number on input when type is number and formatNumberValue is true', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.componentRef.setInput('formatNumberValue', true);
    fixture.detectChanges();

    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = '1,234';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).toHaveBeenCalledWith(1234);
  });

  it('should hide password toggle when loading is true', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.nmf-password-toggle'));
    expect(button).toBeNull();
  });
});
