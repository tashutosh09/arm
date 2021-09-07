import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AppConfigService } from './app-config.service';
import * as appConfig from './app-config.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AppConfigEffects {

  @Effect() get$ = this.actions$
    .ofType(appConfig.GET_CONFIG)
    .switchMap(payload => this.appConfigService.get()
      // If successful, dispatch success action with result
      .map(res => ({ type: appConfig.GET_CONFIG_SUCCESS, payload: res.results }))
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: appConfig.GET_CONFIG_ERROR }))
    );

  constructor(
    private appConfigService: AppConfigService,
    private actions$: Actions
  ) { }

}
