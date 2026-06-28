import { InjectionToken, Provider } from '@angular/core';
import { ValidationMessages } from '../types';

export interface NmfConfig {
  translate?: (key: string, params?: Record<string, unknown>) => string;
  validationMessages?: ValidationMessages;
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
  validationMessages: {
    required: 'This field is required',
    minLength: 'Minimum length is {{minLength}}',
    maxLength: 'Maximum length is {{maxLength}}',
    min: 'Minimum value is {{min}}',
    max: 'Maximum value is {{max}}',
    email: 'Invalid email address',
    pattern: 'Invalid format',
    fallback: 'Invalid value',
  },
};

export const NMF_CONFIG = new InjectionToken<NmfConfig>('NMF_CONFIG', {
  factory: () => DEFAULT_NMF_CONFIG,
});

export function provideNmfConfig(config: Partial<NmfConfig>): Provider[] {
  return [
    {
      provide: NMF_CONFIG,
      useValue: {
        ...DEFAULT_NMF_CONFIG,
        ...config,
        validationMessages: {
          ...DEFAULT_NMF_CONFIG.validationMessages,
          ...config.validationMessages,
        },
      },
    },
  ];
}

export function provideNmfConfigFactory(factory: () => NmfConfig): Provider {
  return {
    provide: NMF_CONFIG,
    useFactory: factory,
  };
}
