import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  MatInputSelectComponent,
  SelectOption,
} from './mat-input-select.component';

describe('MatInputSelectComponent', () => {
  let fixture: ComponentFixture<MatInputSelectComponent>;
  let component: MatInputSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputSelectComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', [
      { key: 'one', label: 'One' },
      { key: 'two', label: 'Two', disabled: true },
    ] as SelectOption[]);
    fixture.componentRef.setInput('emptyOptionLabel', 'Pick one');
    fixture.componentRef.setInput('clearOptionLabel', 'Clear selection');
    fixture.detectChanges();
  });

  it('binds the empty option label and clear option label', () => {
    expect(component.emptyOptionLabel()).toBe('Pick one');
    expect(component.clearOptionLabel()).toBe('Clear selection');
    expect(component.options().length).toBe(2);
  });

  it('updates its internal form control value when the selection value changes programmatically', () => {
    component.formControl.setValue('one');
    fixture.detectChanges();

    expect(component.formControl.value).toBe('one');
  });
});
