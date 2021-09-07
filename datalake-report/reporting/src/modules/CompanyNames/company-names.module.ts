import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CompanyNamesService } from './company-names.service';
import { companyNamesReducer } from './company-names.reducer';
import { CompanyNamesEffects } from './company-names.effects';


@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("CompanyNames", companyNamesReducer),
    EffectsModule.forFeature([CompanyNamesEffects])
  ],
  exports: [],
  declarations: []
})
export class CompanyNamesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CompanyNamesModule,
      providers: [CompanyNamesService]
    };
  }
}


export { CompanyNamesService } from './company-names.service';
export * from './company-names.actions';
export { CompanyNamesState } from './company-names.state';
