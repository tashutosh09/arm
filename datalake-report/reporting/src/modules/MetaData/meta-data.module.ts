import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MetaDataService } from './meta-data.service';
import { metaDataReducer } from './meta-data.reducer';
import { MetaDataEffects } from './meta-data.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('MetaData', metaDataReducer),
    EffectsModule.forFeature([MetaDataEffects])
  ],
  exports: [],
  declarations: []
})
export class MetaDataModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MetaDataModule,
      providers: [MetaDataService]
    };
  }
}

export { MetaDataService } from './meta-data.service';
export * from './meta-data.actions';
export { MetaDataState } from './meta-data.state';
