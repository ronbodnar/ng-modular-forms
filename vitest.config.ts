/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  resolve: {
    alias: {
      '@ng-modular-forms/behavior': resolve(
        __dirname,
        'projects/behavior/src/public-api.ts',
      ),
      '@ng-modular-forms/core': resolve(
        __dirname,
        'projects/core/src/public-api.ts',
      ),
      '@ng-modular-forms/material': resolve(
        __dirname,
        'projects/material/src/public-api.ts',
      ),
      '@ng-modular-forms/input': resolve(
        __dirname,
        'projects/input/src/public-api.ts',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['projects/**/lib/**/*.spec.ts', 'projects/**/src/**/*.spec.ts'],
    reports: ['default'],
  },
}));
