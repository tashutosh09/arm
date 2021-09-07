import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CompanyNamesService } from './company-names.service';
import * as companyNames from './company-names.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class CompanyNamesEffects {

  @Effect() get$ = this.actions$
    .ofType(companyNames.GET)
    .map(toPayload)
    .switchMap(payload => this.companyNamesService.get(payload)
      .map(res => ({ type: companyNames.GET_SUCCESS, payload: res.results }))
      .catch(() => Observable.of({ type: companyNames.GET_ERROR }))
    );

  constructor(
    private companyNamesService: CompanyNamesService,
    private actions$: Actions
  ) { }

}
