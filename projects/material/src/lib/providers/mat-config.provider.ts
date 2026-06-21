// @ng-modular-forms/material
import { InjectionToken, Provider } from '@angular/core';
import {
  FloatLabelType,
  MatFormFieldAppearance,
} from '@angular/material/form-field';

export interface NmfMaterialConfig {
  appearance?: MatFormFieldAppearance;
  floatLabel?: FloatLabelType;
  detachLabels?: boolean;
  hideRequiredMarker?: boolean;
}

const MATERIAL_DEFAULTS: Required<NmfMaterialConfig> = {
  appearance: 'outline',
  floatLabel: 'auto',
  detachLabels: false,
  hideRequiredMarker: false,
};

export const NMF_MATERIAL_CONFIG = new InjectionToken<NmfMaterialConfig>(
  'NMF_MATERIAL_CONFIG',
  {
    factory: () => {
      return {
        ...MATERIAL_DEFAULTS,
      };
    },
  },
);

export function provideNmfMaterialConfig(
  config: Partial<NmfMaterialConfig>,
): Provider[] {
  return [
    {
      provide: NMF_MATERIAL_CONFIG,
      useFactory: () => {
        return {
          ...MATERIAL_DEFAULTS,
          ...config,
        };
      },
    },
  ];
}
