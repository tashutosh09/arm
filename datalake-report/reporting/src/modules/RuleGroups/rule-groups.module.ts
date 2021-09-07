import { InterceptorModule } from './../Network/InterceptorModule';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RuleGroupsService } from './rule-groups.service';
import { ruleGroupsReducer } from './rule-groups.reducer';
import { RuleGroupsEffects } from './rule-groups.effects';

@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("RuleGroups", ruleGroupsReducer),
    EffectsModule.forFeature([RuleGroupsEffects])
  ],
  exports: [],
  declarations: []
})
export class RuleGroupsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RuleGroupsModule,
      providers: [RuleGroupsService]
    };
  }
}


export { RuleGroupsService } from './rule-groups.service';
export * from './rule-groups.actions';
export { RuleGroupsState } from './rule-groups.state';
