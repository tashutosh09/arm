import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppViewsService } from './app-views.service';
import { appViewsReducer } from './app-views.reducer';
import { AppViewsEffects } from './app-views.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('AppViews', appViewsReducer),
    EffectsModule.forFeature([AppViewsEffects])
  ],
  exports: [],
  declarations: []
})
export class AppViewsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppViewsModule,
      providers: [AppViewsService]
    };
  }
}

export { AppViewsService } from './app-views.service';
export * from './app-views.actions';
export { AppViewsState } from './app-views.state';
