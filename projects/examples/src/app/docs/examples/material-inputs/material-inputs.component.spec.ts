import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialInputsExampleComponent } from './material-inputs.component';
import { provideHttpClient } from '@angular/common/http';

describe('MaterialInputsFormComponent', () => {
  let fixture: ComponentFixture<MaterialInputsExampleComponent>;
  let component: MaterialInputsExampleComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [MaterialInputsExampleComponent, ReactiveFormsModule],
      providers: [provideHttpClient()],
    });
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(MaterialInputsExampleComponent);
    component = fixture.componentInstance;
  });

  it('sets expected values when populateForm is called', () => {
    component.populateForm();

    expect(component.form.value).toEqual({
      text: 'Hello World',
      date: expect.any(Date),
      time: expect.any(Date),
      number: 1230,
      numberFormatted: 1230,
      password: '12345678',
      select: 'us',
      currency: 1230,
      textarea: expect.stringContaining('Hello'),
      lookup: 'us',
    });
  });
});
