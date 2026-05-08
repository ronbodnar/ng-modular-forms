import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NativeInputsExampleComponent } from './native-inputs.component';

describe('BasicInputsFormComponent', () => {
  let component: NativeInputsExampleComponent;
  let fixture: ComponentFixture<NativeInputsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeInputsExampleComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NativeInputsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sets expected values when populateForm is called', () => {
    const component = fixture.componentInstance;

    component.populateForm();

    const value = component.form.value;

    expect(value.text).toBe('Hello World');
    expect(value.number).toBe(1230);
    expect(value.numberFormatted).toBe(1230);
    expect(value.password).toBe('12345678');
    expect(value.select).toBe('us');
    expect(value.currency).toBe(1230);
    expect(value.textarea).toContain('Hello');
  });
});
