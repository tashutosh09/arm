import { InterceptorModule } from '../Network/InterceptorModule';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IndustryRuleService } from './industry-rule.service';
import { industryRuleReducer } from './industry-rule.reducer';
import { IndustryRuleEffects } from './industry-rule.effects';

@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("IndustryRules", industryRuleReducer),
    EffectsModule.forFeature([IndustryRuleEffects])
  ],
  exports: [],
  declarations: []
})
export class IndustryRuleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IndustryRuleModule,
      providers: [IndustryRuleService]
    };
  }
}


export { IndustryRuleService } from './industry-rule.service';
export * from './industry-rule.actions';
export { IndustryRuleState } from './industry-rule.state';
