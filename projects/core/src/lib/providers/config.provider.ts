import { InjectionToken, Provider } from '@angular/core';
import { NmfTranslations } from '../types';

export interface NmfConfig {
  translate: (key: string, params?: Record<string, unknown>) => string;
  translations: NmfTranslations;
}

const DEFAULT_NMF_CONFIG: Required<NmfConfig> = {
  translate: (key: string, params?: Record<string, unknown>) => {
    if (!params) {
      return key;
    }
    return Object.keys(params).reduce((acc, paramKey) => {
      return acc.replace(
        new RegExp(`{{${paramKey}}}`, 'g'),
        String(params[paramKey]),
      );
    }, key);
  },
  translations: {
    fileSelector: {
      filesSelected: '{{count}} files selected',
    },
    validationMessages: {
      required: 'This field is required',
      minLength: 'Minimum length is {{requiredLength}}',
      maxLength: 'Maximum length is {{requiredLength}}',
      min: 'Minimum value is {{min}}',
      max: 'Maximum value is {{max}}',
      email: 'Invalid email address',
      pattern: 'Invalid format',
      fallback: 'Invalid value',
    },
  },
};

export const NMF_CONFIG = new InjectionToken<NmfConfig>('NMF_CONFIG', {
  factory: () => DEFAULT_NMF_CONFIG,
});

export function provideNmfConfig(config: Partial<NmfConfig>): Provider {
  return {
    provide: NMF_CONFIG,
    useValue: mergeConfig(config),
  };
}

export function provideNmfConfigFactory(
  factory: () => Partial<NmfConfig>,
): Provider {
  return {
    provide: NMF_CONFIG,
    useFactory: () => mergeConfig(factory()),
  };
}

function mergeConfig(config: Partial<NmfConfig>): NmfConfig {
  return {
    ...DEFAULT_NMF_CONFIG,
    ...config,
    translations: mergeTranslations(
      DEFAULT_NMF_CONFIG.translations,
      config.translations,
    ),
  };
}

function mergeTranslations(
  defaults: NmfTranslations,
  overrides?: Partial<NmfTranslations>,
): NmfTranslations {
  return {
    ...defaults,
    ...overrides,
    fileSelector: {
      ...defaults.fileSelector,
      ...overrides?.fileSelector,
    },
    validationMessages: {
      ...defaults.validationMessages,
      ...overrides?.validationMessages,
    },
  };
}
