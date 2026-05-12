import { TestBed } from '@angular/core/testing';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CodeBlockComponent } from './code-block.component';

describe('CodeBlockComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeBlockComponent],
      providers: [
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            coreLibraryLoader: () =>
              Promise.resolve({
                highlight: vi.fn(),
                highlightAuto: vi.fn(),
                configure: vi.fn(),
                registerLanguage: vi.fn(),
              }),

            languages: {
              typescript: () => Promise.resolve({}),
              javascript: () => Promise.resolve({}),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);

    fixture.componentRef.setInput('id', 'test');
    fixture.componentRef.setInput('code', 'console.log("test")');

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
