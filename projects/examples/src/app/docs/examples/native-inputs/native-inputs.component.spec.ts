import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NativeInputsExampleComponent } from './native-inputs.component';
import { provideHttpClient } from '@angular/common/http';

describe('BasicInputsFormComponent', () => {
  let fixture: ComponentFixture<NativeInputsExampleComponent>;
  let component: NativeInputsExampleComponent;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NativeInputsExampleComponent, ReactiveFormsModule],
      providers: [provideHttpClient()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeInputsExampleComponent);
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
      lookupSync: 'us',
      lookupAsync: {
        code: 'us',
        name: 'United States',
      },
      array: [{ text: 'Array value 1' }, { text: 'Array value 2' }],
    });
  });
});
