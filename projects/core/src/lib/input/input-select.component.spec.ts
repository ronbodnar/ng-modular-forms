import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputSelectComponent, SelectOption } from './input-select.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputSelectComponent],
  template: `
    <form [formGroup]="form">
      <nmf-select
        formControlName="choice"
        [options]="options"
        [emptyOptionLabel]="emptyOptionLabel"
        [clearOptionLabel]="clearOptionLabel"
      />
    </form>
  `,
})
class HostComponent {
  emptyOptionLabel = 'Pick one';
  clearOptionLabel = 'Reset';

  options: SelectOption[] = [
    { key: 'one', label: 'One' },
    { key: 'two', label: 'Two', disabled: true },
  ];

  form = new FormGroup({
    choice: new FormControl<string | number | null>(null),
  });
}

describe('InputSelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let select: HTMLSelectElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    select = fixture.debugElement.query(By.css('select')).nativeElement;
  });

  it('renders options correctly', () => {
    const labels = Array.from(select.options).map((o) => o.text);

    expect(labels).toContain('Pick one');
    expect(labels).toContain('One');
    expect(labels).toContain('Two');
    expect(labels).toContain('Reset');
  });

  it('updates form control on selection', () => {
    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.form.value.choice).toBe('one');
  });
});
