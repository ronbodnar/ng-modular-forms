import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormNoOrchestrationComponent } from './simple-form-no-orchestration.component';

describe('SimpleFormNoOrchestrationComponent', () => {
  let component: SimpleFormNoOrchestrationComponent;
  let fixture: ComponentFixture<SimpleFormNoOrchestrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFormNoOrchestrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFormNoOrchestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
