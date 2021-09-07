import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppConfigService } from './app-config.service';
import { appConfigReducer } from './app-config.reducer';
import { AppConfigEffects } from './app-config.effects';

import { InterceptorModule } from './../Network/InterceptorModule';

@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("AppConfig", appConfigReducer),
    EffectsModule.forFeature([AppConfigEffects])
  ],
  exports: [],
  declarations: []
})
export class AppConfigModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppConfigModule,
      providers: [AppConfigService]
    };
  }
}


export { AppConfigService } from './app-config.service';
export * from './app-config.actions';
export { AppConfigState } from './app-config.state';
