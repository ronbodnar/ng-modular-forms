import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideRouter(routes),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        shell: () => import('highlight.js/lib/languages/shell'),
        xml: () => import('highlight.js/lib/languages/xml'),
        json: () => import('highlight.js/lib/languages/json'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
      },
      themePath: 'assets/highlightjs/stackoverflow-dark.css', // Optional, useful for dynamic theme changes
    }),
  ],
};
