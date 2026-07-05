import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, it, beforeEach, expect } from 'vitest';

import { InputRangeComponent } from './range.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputRangeComponent],
  template: `
    <form [formGroup]="form">
      <nmf-range
        formControlName="number"
        [min]="0"
        [max]="100"
        [tickCount]="5"
        [showTicks]="true"
      />
    </form>
  `,
})
class HostComponent {
  form = new FormGroup({
    number: new FormControl<number | null>(50),
  });
}

describe('InputRangeComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('renders initial form value', () => {
    expect(input.value).toBe('50');
  });

  it('updates form control when slider changes', () => {
    input.value = '80';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.form.controls.number.value).toBe(80);
  });

  it('updates UI when form control changes programmatically', () => {
    host.form.controls.number.setValue(25);
    fixture.detectChanges();

    expect(input.value).toBe('25');
  });

  it('respects min/max bounds visually', () => {
    host.form.controls.number.setValue(-10);
    fixture.detectChanges();

    expect(input.value).toBe('0');

    host.form.controls.number.setValue(999);
    fixture.detectChanges();

    expect(input.value).toBe('100');
  });

  it('disables input when form control is disabled', () => {
    host.form.controls.number.disable();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });

  it('enables input when form control is enabled', () => {
    host.form.controls.number.disable();
    fixture.detectChanges();

    host.form.controls.number.enable();
    fixture.detectChanges();

    expect(input.disabled).toBe(false);
  });

  it('renders tick markers when enabled', () => {
    const ticks = fixture.debugElement.queryAll(
      By.css('.nmf-range-ticks option'),
    );
    expect(ticks.length).toBe(5);
  });

  it('updates popup value when slider moves', () => {
    input.value = '70';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const popup = fixture.debugElement.query(By.css('.nmf-range-popup'));
    expect(popup.nativeElement.textContent.trim()).toBe('70');
  });
});
