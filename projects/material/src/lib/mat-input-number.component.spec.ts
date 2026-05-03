import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputNumberComponent } from './mat-input-number.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MatInputNumberComponent', () => {
  let fixture: ComponentFixture<MatInputNumberComponent>;
  let component: MatInputNumberComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputNumberComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputNumberComponent);
    component = fixture.componentInstance;
  });

  it('formats values when formatNumberValue is true', () => {
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

  it('calls onChange with parsed number on input when type is number and formatNumberValue is true', () => {
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
});
