import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RuleQueryService } from './rule-query.service';


@NgModule({
  imports: [
    InterceptorModule,
  ],
  exports: [],
  declarations: []
})
export class RuleQueryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RuleQueryModule,
      providers: [RuleQueryService]
    };
  }
}


export { RuleQueryService } from './rule-query.service';
