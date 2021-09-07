import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { FeedService } from './feed.service';
import * as feed from './feed.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';


@Injectable()
export class FeedEffects {

    constructor(private feedService: FeedService, private actions$: Actions) {}

    @Effect() get$ = this.actions$
    .ofType(feed.GET)
    .map(toPayload)
    .switchMap(payload => this.feedService.get(payload)
      .map(res => ({ type: feed.GET_SUCCESS, payload: res.results }))
      .catch(() => Observable.of({ type: feed.GET_ERROR }))
    );

}