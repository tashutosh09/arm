import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RuleRunHistoryService } from './rule-run-history.service';


@NgModule({
  imports: [
    InterceptorModule,
  ],
  exports: [],
  declarations: []
})
export class RuleRunHistoryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RuleRunHistoryModule,
      providers: [RuleRunHistoryService]
    };
  }
}


export { RuleRunHistoryService } from './rule-run-history.service';
