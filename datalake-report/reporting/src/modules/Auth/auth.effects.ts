import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as auth from './auth.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthEffects {

  @Effect() get$ = this.actions$
    .ofType(auth.LOGIN)
    .map(toPayload)
    .switchMap(payload => this.authService.get(payload.username, payload.password)
      // If successful, dispatch success action with result
      .map(res => {
        if (res.status) {
          return ({ type: auth.LOGIN_SUCCESS, payload: res })
        } else {
          return ({ type: auth.LOGIN_ERROR, payload: (res && res.results ? res.results.message : 'Unknown error') })
        }
      })
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: auth.LOGIN_ERROR }))
    );


  constructor(
    private authService: AuthService,
    private actions$: Actions
  ) { }

}
