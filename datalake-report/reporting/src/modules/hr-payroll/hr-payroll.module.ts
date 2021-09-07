import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HRPayrollService } from './hr-payroll.service';
import { hrPayrollReducer } from './hr-payroll.reducer';
import { hrPayrollEffects } from './hr-payroll.effects';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forFeature('HRPayrollPage', hrPayrollReducer),
    EffectsModule.forFeature([hrPayrollEffects])
  ],
  exports: [],
  declarations: []
})
export class HRPayrollModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HRPayrollModule,
      providers: [HRPayrollService]
    };
  }
}

export { HRPayrollService } from './hr-payroll.service';
export * from './hr-payroll.actions';
export { HRPayrollState } from './hr-payroll.state';
