import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { HRPayrollService } from './hr-payroll.service';
import * as hrPayrollViews from './hr-payroll.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class hrPayrollEffects {

  constructor(
    private hrPayrollService: HRPayrollService,
    private actions$: Actions
  ) { }

}
