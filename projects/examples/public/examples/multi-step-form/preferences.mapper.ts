import { FormMapperBase } from '@ng-modular-forms/core';

interface PreferencesModel {
  monthlyBudget?: number;
  referralSource?: string;
  comments?: string;
  agreeToTerms: boolean;
}

export class PreferencesMapper extends FormMapperBase<PreferencesModel> {
  override toRequest(model: PreferencesModel) {
    return {
      monthlyBudget: model.monthlyBudget,
      referralSource: model.referralSource,
      comments: model.comments?.replace(/ {2,}/g, ' ').trim(),
      agreeToTerms: model.agreeToTerms,
    };
  }
}
