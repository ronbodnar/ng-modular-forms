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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.form.contains('text')).toBeTruthy();
    expect(component.form.contains('number')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
    expect(component.form.contains('select')).toBeTruthy();
    expect(component.form.contains('currency')).toBeTruthy();
    expect(component.form.contains('textarea')).toBeTruthy();
  });
});
