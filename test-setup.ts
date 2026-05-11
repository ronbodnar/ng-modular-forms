import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: HIGHLIGHT_OPTIONS,
        useValue: {
          coreLibraryLoader: async () => ({
            highlight: vi.fn(),
            highlightAuto: vi.fn(),
            configure: vi.fn(),
            registerLanguage: vi.fn(),
          }),

          languages: {
            typescript: async () => ({}),
          },
        },
      },
    ],
  });
});
