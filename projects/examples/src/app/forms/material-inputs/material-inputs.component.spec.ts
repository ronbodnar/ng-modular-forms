import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialInputsFormComponent } from './material-inputs.component';

describe('MaterialInputsFormComponent', () => {
  let component: MaterialInputsFormComponent;
  let fixture: ComponentFixture<MaterialInputsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialInputsFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialInputsFormComponent);
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
