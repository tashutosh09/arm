import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthService } from './auth.service';
import { authReducer } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import { InterceptorModule } from './../Network/InterceptorModule';

@NgModule({
  imports: [
    InterceptorModule,
    StoreModule.forFeature("Auth", authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [],
  declarations: []
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [AuthService]
    };
  }
}


export { AuthService } from './auth.service';
export * from './auth.actions';
export { AuthState } from './auth.state';
