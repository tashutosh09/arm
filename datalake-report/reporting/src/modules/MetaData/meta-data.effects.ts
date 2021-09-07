import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { MetaDataService } from './meta-data.service';
import * as metaData from './meta-data.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class MetaDataEffects {

  @Effect() get$ = this.actions$
      .ofType(metaData.GET)
      .map(toPayload)
      .switchMap((payload) => this.metaDataService.get(payload)
        .map((res) => {
          if (res.status && res.results) {
            return ({ type: metaData.GET_SUCCESS, payload: res.results[0] })
          } else {
            return ({ type: metaData.GET_ERROR })
          }
        })
        .catch(() => Observable.of({ type: metaData.GET_ERROR}))
      );

  constructor(
    private metaDataService: MetaDataService,
    private actions$: Actions
  ) { }

}
