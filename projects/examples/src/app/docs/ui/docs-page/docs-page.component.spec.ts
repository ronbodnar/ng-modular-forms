import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsPageComponent } from './docs-page.component';

describe('DocsPageComponent', () => {
  let fixture: ComponentFixture<DocsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsPageComponent);
    fixture.detectChanges();
  });

  const text = () => fixture.nativeElement.textContent as string;

  it('renders title', () => {
    fixture.componentRef.setInput('title', 'My Example');
    fixture.detectChanges();

    expect(text()).toContain('My Example');
  });
});
