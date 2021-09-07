import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RulesService } from './rules.service';
import { rulesReducer } from './rules.reducer';
import { RulesEffects } from './rules.effects';

@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("rules", rulesReducer),
    EffectsModule.forFeature([RulesEffects])
  ],
  exports: [],
  declarations: []
})
export class RulesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RulesModule,
      providers: [RulesService]
    };
  }
}


export { RulesService } from './rules.service';
export * from './rules.actions';
export { RulesState } from './rules.state';
