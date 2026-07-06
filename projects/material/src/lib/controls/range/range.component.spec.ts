import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputRangeComponent } from './range.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MatInputRangeComponent', () => {
  let fixture: ComponentFixture<MatInputRangeComponent>;
  let component: MatInputRangeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputRangeComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputRangeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('emits numeric value when slider control changes', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    component.onSingleChange(42);

    expect(onChange).toHaveBeenCalledWith(42);
  });

  it('does not emit when programmatically setting writeValue', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    component.writeValue(50);
    fixture.detectChanges();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles null values correctly', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    component.writeValue(null);
    fixture.detectChanges();

    expect(component.value()).toBeNull();
  });

  it('updates control value via writeValue', () => {
    component.writeValue(75);
    fixture.detectChanges();

    expect(component.value()).toBe(75);
  });

  it('applies default inputs correctly', () => {
    expect(component.min()).toBeNull();
    expect(component.max()).toBeNull();
    expect(component.step()).toBeNull();
    expect(component.discrete()).toBe(true);
    expect(component.showTickMarks()).toBe(false);
  });

  it('accepts input configuration overrides', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('step', 5);
    fixture.componentRef.setInput('discrete', false);
    fixture.componentRef.setInput('showTickMarks', true);

    fixture.detectChanges();

    expect(component.min()).toBe(10);
    expect(component.max()).toBe(100);
    expect(component.step()).toBe(5);
    expect(component.discrete()).toBe(false);
    expect(component.showTickMarks()).toBe(true);
  });

  it('keeps control instance stable', () => {
    const controlRef = component.control;

    component.writeValue(10);
    component.writeValue(20);

    expect(component.control).toBe(controlRef);
  });
});
