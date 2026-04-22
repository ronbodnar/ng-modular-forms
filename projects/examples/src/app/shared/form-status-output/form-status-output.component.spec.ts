import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatusOutputComponent } from './form-status-output.component';

describe('FormStatusOutputComponent', () => {
  let component: FormStatusOutputComponent;
  let fixture: ComponentFixture<FormStatusOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStatusOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStatusOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
